# ============================================================================
# CADBridge Pro — Ruby Extension per SketchUp (dalla versione 2021+)
# Compatibile con SketchUp 2021, 2022, 2023, 2024, 2025, 2026 (Ruby 2.7 / 3.x)
# ============================================================================
require 'sketchup.rb'

module CADBridgePro
  LIVE_FILE = 'C:/Users/Public/cadbridge_live_cmd.rb'
  @last_mtime = nil
  @timer = nil

  def self.start_listener
    UI.stop_timer(@timer) if @timer
    @timer = UI.start_timer(1.5, true) do
      if File.exist?(LIVE_FILE)
        mtime = File.mtime(LIVE_FILE)
        if @last_mtime != mtime
          @last_mtime = mtime
          begin
            load LIVE_FILE
          rescue => e
            puts "[CADBridge Pro Errore]: #{e.message}"
          end
        end
      end
    end
    UI.messagebox("CADBridge Pro (SketchUp 2021+) Connesso e in ascolto in tempo reale!")
  end

  unless file_loaded?(__FILE__)
    menu = UI.menu('Plugins')
    menu.add_item('⚡ Attiva CADBridge Pro Live Sync (2021+)') { self.start_listener }
    file_loaded(__FILE__)
  end
end
