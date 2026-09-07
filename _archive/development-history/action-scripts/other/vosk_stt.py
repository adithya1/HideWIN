import sys
import json
import audioop

try:
    import vosk
    vosk.SetLogLevel(-1)
    from vosk import Model, KaldiRecognizer

    model = Model("model")
    # Vosk small-en-us model is trained at 16kHz
    rec = KaldiRecognizer(model, 16000)
    rec.SetWords(True)

    state = None  # audioop.ratecv state

    # Read binary PCM chunks from stdin (24kHz, 16-bit, mono)
    # and resample to 16kHz before feeding to Vosk
    while True:
        data = sys.stdin.buffer.read(4800)  # 100ms of 24kHz audio = 4800 bytes
        if len(data) == 0:
            break

        # Resample from 24000 Hz to 16000 Hz using Python stdlib audioop
        resampled, state = audioop.ratecv(data, 2, 1, 24000, 16000, state)

        if rec.AcceptWaveform(resampled):
            result = json.loads(rec.Result())
            text = result.get("text", "").strip()
            if text:
                sys.stdout.write(json.dumps({"text": text}) + "\n")
                sys.stdout.flush()
        else:
            partial = json.loads(rec.PartialResult())
            word = partial.get("partial", "").strip()
            if word:
                sys.stdout.write(json.dumps({"partial": word}) + "\n")
                sys.stdout.flush()

except Exception as e:
    sys.stderr.write("[Vosk fatal] " + str(e) + "\n")
    sys.stderr.flush()
