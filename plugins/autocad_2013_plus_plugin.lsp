; ============================================================================
; CADBridge Pro — AutoLISP Plugin Ufficiale per AutoCAD (dalla versione 2013+)
; Compatibile con AutoCAD 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020,
; 2021, 2022, 2023, 2024, 2025, 2026.
; ============================================================================

(defun c:CADBRIDGE_SYNC ()
  (setvar "CMDECHO" 0)
  (setq liveFile "C:/Users/Public/cadbridge_live_cmd.lsp")
  (if (findfile liveFile)
    (progn
      (load liveFile)
      (princ "\n[CADBridge Pro] Comando remoto eseguito con successo!")
    )
    (princ "\n[CADBridge Pro] Nessun file live trovato in C:/Users/Public/cadbridge_live_cmd.lsp")
  )
  (princ)
)

(princ "\n==================================================================")
(princ "\n  CADBridge Pro (AutoCAD 2013+) Caricato! Digita: CADBRIDGE_SYNC")
(princ "\n==================================================================")
(princ)
