#!/usr/bin/env bash
set -euo pipefail
root=$(pwd)
tmp=$(mktemp -d)
mkdir -p assets/sprites/lamplighter/walk assets/sprites/enemies assets/sprites/puff assets/sprites/gems assets/sprites/pickups assets/sprites/effects assets/icons assets/audio

still(){ local out=$1 w=$2 h=$3 c1=$4 c2=$5 kind=${6:-gem}; mkdir -p "$(dirname "$out")"; local cfg="$tmp/draw.json"; printf '{"width":%s,"height":%s,"background":"transparent","actions":"%s/actions.json","preview":"%s","layers":"%s/layers.json"}' "$w" "$h" "$tmp" "$root/$out" "$tmp" > "$cfg"; draw --config "$cfg" init >/dev/null; if [[ $kind == tile ]]; then draw --config "$cfg" fill-background --color "$c1" >/dev/null; draw --config "$cfg" line --x0 0 --y0 16 --x1 63 --y1 16 --color "$c2" >/dev/null; draw --config "$cfg" line --x0 20 --y0 0 --x1 20 --y1 63 --color "$c2" >/dev/null; draw --config "$cfg" line --x0 4 --y0 44 --x1 40 --y1 44 --color '#17192b' >/dev/null; else draw --config "$cfg" fill-circle --cx $((w/2)) --cy $((h/2)) --r $((w<h?w/3:h/3)) --color "$c1" >/dev/null; draw --config "$cfg" stroke-circle --cx $((w/2)) --cy $((h/2)) --r $((w<h?w/3:h/3)) --color "$c2" >/dev/null; draw --config "$cfg" line --x0 $((w/2)) --y0 2 --x1 $((w/2)) --y1 $((h-3)) --color "$c2" >/dev/null; fi; }

sheet(){ local dir=$1 frames=$2 w=$3 h=$4 c1=$5 c2=$6 shape=${7:-creature}; mkdir -p "$dir"; local cfg="$tmp/sheet.json"; local fr="["; for ((j=0;j<frames;j++)); do [[ $j -gt 0 ]] && fr+=","; fr+="$j"; done; fr+="]"; printf '{"width":%s,"height":%s,"background":"transparent","frames":%s,"actions":"%s/a-{frame}.json","preview":"%s/%s/{frame}.png","layers":"%s/slayers.json"}' "$w" "$h" "$fr" "$tmp" "$root" "$dir" "$tmp" > "$cfg"; draw-sheet --config "$cfg" init >/dev/null; for ((i=0;i<frames;i++)); do local bob=$((i%2)); draw-sheet --config "$cfg" --frame "$i" fill-circle --cx $((w/2)) --cy $((h/2+bob)) --r $((w<h?w/3:h/3)) --color "$c1" >/dev/null; draw-sheet --config "$cfg" --frame "$i" stroke-circle --cx $((w/2)) --cy $((h/2+bob)) --r $((w<h?w/3:h/3)) --color "$c2" >/dev/null; draw-sheet --config "$cfg" --frame "$i" line --x0 $((2+i%3)) --y0 $((h/2)) --x1 $((w-3-i%3)) --y1 $((h/2)) --color "$c2" >/dev/null; done; }

# Night cobbles and the warm lamplighter.
still assets/sprites/ground.png 64 64 '#101527' '#232b43' tile
still assets/sprites/lamplighter/idle.png 24 32 '#e6a84a' '#fff0a0'
sheet assets/sprites/lamplighter/walk 6 24 32 '#d88b35' '#fff0a0'

ids=(moth bat rat gnat beetle wisp spider crow shade hound mothwing owl dark); sizes=(20 20 24 16 28 20 28 24 32 36 56 72 80); colors=('#8f769c' '#6f5b91' '#8b5e55' '#889b68' '#586d61' '#65b4bc' '#573f67' '#44546c' '#302d4c' '#663d46' '#a05575' '#75699d' '#171421'); accents=('#ded0e8' '#ba9edc' '#dca186' '#d9ea8a' '#93bd8d' '#c4ffff' '#be76b8' '#9fb8dd' '#736f9e' '#dd826e' '#f3a8cf' '#c5b8ff' '#be304b');
for i in "${!ids[@]}"; do sheet "assets/sprites/enemies/${ids[i]}" 4 "${sizes[i]}" "${sizes[i]}" "${colors[i]}" "${accents[i]}"; done
sheet assets/sprites/puff 4 24 24 '#b6a6c8aa' '#f0e2ffcc'
still assets/sprites/gems/small.png 8 8 '#55b8b1' '#c8fff4'; still assets/sprites/gems/medium.png 12 12 '#4a86ca' '#d0eaff'; still assets/sprites/gems/large.png 16 16 '#865fc2' '#f0d5ff'
still assets/sprites/pickups/chest.png 24 24 '#8b512c' '#f2c066'; still assets/sprites/pickups/bread.png 24 24 '#b9783e' '#ffe2a0'; still assets/sprites/pickups/draft.png 24 24 '#4e819c' '#bdefff'

effects=(taper ember pin lantern halo oil-splash shard pyre beacon hail chandelier corona blaze); ews=(120 16 12 28 160 100 16 120 16 12 28 160 100); ehs=(40 16 12 28 160 100 16 40 16 12 28 160 100); ecols=('#dba84d' '#ef6b3e' '#d9d0b4' '#e5b454' '#c39543' '#3e3457' '#9cd4de' '#ff843d' '#ffd75e' '#a4e8ff' '#ffdc7a' '#f7c44f' '#6f2f48');
for i in "${!effects[@]}"; do still "assets/sprites/effects/${effects[i]}.png" "${ews[i]}" "${ehs[i]}" "${ecols[i]}" '#fff1b8'; done
sheet assets/sprites/effects/spark 4 80 80 '#eabf42' '#ffffff'; sheet assets/sprites/effects/sconce 4 24 24 '#d8753d' '#ffe5a3'; sheet assets/sprites/effects/flare 6 128 128 '#e76b3f88' '#fff3ba'

icons=(taper ember pin lantern halo oil-splash spark shard sconce flare pyre beacon hail chandelier corona blaze wick oil glass brass mirror bellows tallow tinder soot lure lamp-oil)
for i in "${!icons[@]}"; do hue=$((i%6)); cols=('#e2a84e' '#d95b47' '#62a8bd' '#8d6cb0' '#65a274' '#bd7d55'); still "assets/icons/${icons[i]}.png" 24 24 "${cols[hue]}" '#fff0b0'; done

# Individually voiced cues: pitch, duration and waveform vary by event.
cues=(hit kill gem hurt level-up choose chest evolve pickup fallen dawn menu-move menu-confirm hum); freqs=(180 110 880 95 440 620 150 330 740 73 220 520 700 55); tos=(120 55 1320 60 880 780 300 990 980 45 440 600 900 55); durs=(90 220 100 300 420 100 500 700 140 1200 1500 60 120 3000); waves=(noise saw sine square triangle sine triangle saw sine saw triangle square triangle sine)
for i in "${!cues[@]}"; do cfg="$tmp/sfx.json"; printf '{"sample_rate":44100,"channels":"stereo","max_duration_ms":4000,"seed":%s,"actions":"%s/sfx-actions.json","preview":"%s/sfx.png","wav":"%s/assets/audio/%s.wav"}' "$((40+i))" "$tmp" "$tmp" "$root" "${cues[i]}" > "$cfg"; sfx-synth --config "$cfg" init >/dev/null; sfx-synth --config "$cfg" add-voice --name body --wave "${waves[i]}" --freq "${freqs[i]}" --gain -14 --dur "${durs[i]}" >/dev/null; sfx-synth --config "$cfg" set-envelope --voice body --env "$([[ ${cues[i]} == hum ]] && echo gate || echo pluck)" >/dev/null; sfx-synth --config "$cfg" set-pitch --voice body --slide-to "${tos[i]}" --over "${durs[i]}" >/dev/null; sfx-synth --config "$cfg" render >/dev/null; done

# 32-second minor-key nocturne; exact four-bar harmony repeats seamlessly.
cfg="$tmp/music.json"; printf '{"sample_rate":44100,"channels":"stereo","max_duration_ms":34000,"seed":91,"instrument_bank":"cinematic","actions":"%s/music-actions.json","preview":"%s/music.png","wav":"%s/assets/audio/music.wav","mid":"%s/assets/audio/music.mid"}' "$tmp" "$tmp" "$root" "$root" > "$cfg"; music --config "$cfg" init >/dev/null; music --config "$cfg" set-tempo --bpm 60 >/dev/null; music --config "$cfg" define-track --name bass --instrument sine >/dev/null; music --config "$cfg" define-track --name bell --instrument triangle >/dev/null; music --config "$cfg" set-track-fx --track bass --gain -12 --reverb .35 --env gate >/dev/null; music --config "$cfg" set-track-fx --track bell --gain -18 --reverb .7 --env pluck >/dev/null
roots=(A2 F2 C3 G2 A2 F2 E2 E2); melodies=(E4 C5 A4 E4 F4 C5 A4 F4 G4 E5 C5 G4 B4 G4 E4 B4)
for i in "${!roots[@]}"; do music --config "$cfg" add-note --track bass --pitch "${roots[i]}" --t "$((i*4))" --dur 4 --velocity 68 >/dev/null; done
for i in "${!melodies[@]}"; do music --config "$cfg" add-note --track bell --pitch "${melodies[i]}" --t "$((i*2))" --dur 1 --velocity 58 >/dev/null; done
music --config "$cfg" render >/dev/null
rm -rf "$tmp"
