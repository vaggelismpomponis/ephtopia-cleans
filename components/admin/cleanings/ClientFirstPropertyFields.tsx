'use client';

const INPUT_CLASS =
  'w-full h-9 bg-white border border-border rounded-lg px-3 text-xs sm:text-sm text-navy placeholder:text-muted-light focus:outline-none focus:border-teal transition-colors';
const LABEL_CLASS = 'block text-xs font-semibold text-navy mb-1';

interface ClientFirstPropertyFieldsProps {
  enabled: boolean;
  onToggle: (v: boolean) => void;
  propName: string;
  setPropName: (v: string) => void;
  propFloor: string;
  setPropFloor: (v: string) => void;
  propAddress: string;
  setPropAddress: (v: string) => void;
  propArea: string;
  setPropArea: (v: string) => void;
  propAccessCode: string;
  setPropAccessCode: (v: string) => void;
  propEntryInstructions: string;
  setPropEntryInstructions: (v: string) => void;
}

export function ClientFirstPropertyFields(props: ClientFirstPropertyFieldsProps) {
  return (
    <div className="border-t border-border pt-4 space-y-3">
      <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-navy">
        <input
          type="checkbox"
          checked={props.enabled}
          onChange={(e) => props.onToggle(e.target.checked)}
          className="w-4 h-4 rounded text-teal cursor-pointer"
        />
        <span>Προσθήκη Πρώτου Καταλύματος</span>
      </label>

      {props.enabled && (
        <div className="grid sm:grid-cols-2 gap-3 pt-1">
          <div>
            <label className={LABEL_CLASS}>Όνομα Καταλύματος *</label>
            <input type="text" required={props.enabled} value={props.propName} onChange={(e) => props.setPropName(e.target.value)} placeholder="Όνομα καταλύματος" className={INPUT_CLASS} />
          </div>
          <div>
            <label className={LABEL_CLASS}>Όροφος / Διαμέρισμα</label>
            <input type="text" value={props.propFloor} onChange={(e) => props.setPropFloor(e.target.value)} placeholder="π.χ. 3ος" className={INPUT_CLASS} />
          </div>
          <div>
            <label className={LABEL_CLASS}>Διεύθυνση *</label>
            <input type="text" required={props.enabled} value={props.propAddress} onChange={(e) => props.setPropAddress(e.target.value)} placeholder="Οδός & αριθμός" className={INPUT_CLASS} />
          </div>
          <div>
            <label className={LABEL_CLASS}>Περιοχή / Πόλη</label>
            <input type="text" value={props.propArea} onChange={(e) => props.setPropArea(e.target.value)} placeholder="Περιοχή" className={INPUT_CLASS} />
          </div>
          <div>
            <label className={LABEL_CLASS}>Κωδικός Lockbox / PIN</label>
            <input type="text" value={props.propAccessCode} onChange={(e) => props.setPropAccessCode(e.target.value)} placeholder="Κωδικός" className={`${INPUT_CLASS} font-mono`} />
          </div>
          <div>
            <label className={LABEL_CLASS}>Οδηγίες Εισόδου</label>
            <input type="text" value={props.propEntryInstructions} onChange={(e) => props.setPropEntryInstructions(e.target.value)} placeholder="Κουδούνι / οδηγίες" className={INPUT_CLASS} />
          </div>
        </div>
      )}
    </div>
  );
}

