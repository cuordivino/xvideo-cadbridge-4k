"""
CADBridge Pro — Server Terminale PC Completo per AutoCAD (2013+) & SketchUp (2021+)
- Serve la PWA responsiva su PC e smartphone (Rete Locale / Wi-Fi)
- Espone API live (/api/execute-cad e /api/status) per esecuzione immediata
- Invia comandi ad AutoCAD (dalla versione 2013 alla 2026) tramite COM nativo Windows
  (senza bisogno di librerie esterne) e scrive gli script live per SketchUp 2021+
"""

import os
import json
import socket
import subprocess
from datetime import datetime
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

PUBLIC_LSP = "C:/Users/Public/cadbridge_live_cmd.lsp"
PUBLIC_SCR = "C:/Users/Public/cadbridge_live_cmd.scr"
PUBLIC_RB = "C:/Users/Public/cadbridge_live_cmd.rb"
PUBLIC_DXF = "C:/Users/Public/cadbridge_live_export.dxf"

BRIDGE_STATE = {
    "commands_executed": 0,
    "last_command_title": "Nessuno",
    "last_command_time": "-",
    "autocad_com_status": "Pronto (AutoCAD 2013+ COM / AutoLISP)",
    "sketchup_rb_status": "Pronto (SketchUp 2021+ Live Ruby)"
}


def dispatch_to_autocad_windows(lisp_path: str) -> bool:
    """
    Invia il comando direttamente alla finestra attiva di AutoCAD (2013+)
    usando PowerShell COM nativo di Windows (non richiede pip/pywin32).
    """
    ps_script = f"""
    $ErrorActionPreference = 'Stop'
    try {{
        $acad = [Runtime.InteropServices.Marshal]::GetActiveObject('AutoCAD.Application')
        $doc = $acad.ActiveDocument
        $doc.SendCommand('(load "{lisp_path}")' + "`n")
        Write-Output "OK_COM"
    }} catch {{
        Write-Output "NO_ACTIVE_INSTANCE"
    }}
    """
    try:
        res = subprocess.run(
            ["powershell", "-NoProfile", "-NonInteractive", "-Command", ps_script],
            capture_output=True,
            text=True,
            timeout=3
        )
        return "OK_COM" in (res.stdout or "")
    except Exception:
        return False


def execute_cad_payload(data: dict) -> dict:
    title = data.get("title", "Comando Remoto CADBridge")
    engine = data.get("engine", "both")
    acad_code = data.get("acad", "")
    skp_code = data.get("skp", "")
    dxf_code = data.get("dxf", "")

    acad_sent_live = False

    if acad_code and engine in ("both", "autocad"):
        os.makedirs(os.path.dirname(PUBLIC_LSP), exist_ok=True)
        with open(PUBLIC_LSP, "w", encoding="utf-8") as f:
            f.write(acad_code)
        with open(PUBLIC_SCR, "w", encoding="utf-8") as f:
            f.write(acad_code)
        acad_sent_live = dispatch_to_autocad_windows(PUBLIC_LSP.replace("\\", "/"))

    if skp_code and engine in ("both", "sketchup"):
        os.makedirs(os.path.dirname(PUBLIC_RB), exist_ok=True)
        with open(PUBLIC_RB, "w", encoding="utf-8") as f:
            f.write(skp_code)

    if dxf_code:
        with open(PUBLIC_DXF, "w", encoding="utf-8") as f:
            f.write(dxf_code)

    BRIDGE_STATE["commands_executed"] += 1
    BRIDGE_STATE["last_command_title"] = title
    BRIDGE_STATE["last_command_time"] = datetime.now().strftime("%H:%M:%S")
    BRIDGE_STATE["autocad_com_status"] = (
        "Eseguito Live in AutoCAD!" if acad_sent_live else f"Salvato in {PUBLIC_LSP}"
    )

    print(
        f"[{BRIDGE_STATE['last_command_time']}] ⚡ {title} | "
        f"AutoCAD Live: {'SI' if acad_sent_live else 'File LSP Pronto'} | SketchUp RB: Aggiornato"
    )

    return {
        "ok": True,
        "title": title,
        "autocad_live": acad_sent_live,
        "lsp_path": PUBLIC_LSP,
        "rb_path": PUBLIC_RB,
        "state": BRIDGE_STATE
    }


def get_lan_ip() -> str:
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        return "127.0.0.1"


class CADBridgeHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def do_GET(self):
        if self.path.startswith("/api/status"):
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.end_headers()
            payload = {
                "ok": True,
                "lan_ip": get_lan_ip(),
                "bridge": BRIDGE_STATE
            }
            self.wfile.write(json.dumps(payload).encode("utf-8"))
            return
        return super().do_GET()

    def do_POST(self):
        if self.path.startswith("/api/execute-cad"):
            length = int(self.headers.get("Content-Length", 0))
            raw = self.rfile.read(length).decode("utf-8") if length > 0 else "{}"
            try:
                data = json.loads(raw)
                result = execute_cad_payload(data)
                self.send_response(200)
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self.end_headers()
                self.wfile.write(json.dumps(result).encode("utf-8"))
            except Exception as e:
                self.send_response(500)
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self.end_headers()
                self.wfile.write(json.dumps({"ok": False, "error": str(e)}).encode("utf-8"))
            return

        self.send_response(404)
        self.end_headers()


if __name__ == "__main__":
    root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    os.chdir(root_dir)
    lan_ip = get_lan_ip()
    port = 8088

    print("=" * 74)
    print("  CADBridge Pro — TERMINALE PC ATTIVO (AutoCAD 2013+ & SketchUp 2021+)")
    print("=" * 74)
    print(f"  💻 Apri su questo PC:          http://localhost:{port}")
    print(f"  📱 Apri da iPhone / Android:   http://{lan_ip}:{port}")
    print("=" * 74)

    server = ThreadingHTTPServer(("0.0.0.0", port), CADBridgeHandler)
    server.serve_forever()
