export type CommandPayload = string;

export interface ICommandAction {
  raw: string;
  valid: boolean;
  action: string;
  meta: any;
}

export function parseCommand(msg: string): ICommandAction {
  const raw = msg.replace(/^(['"])(.+)\1$/, "$2");
  try {
    const { typ, action, meta } = JSON.parse(raw);
    return {
      raw,
      valid: (/cmd/i).test(typ),
      action: (action || '').toLowerCase(),
      meta,
    };
  } catch (e) {
    return {
      raw,
      valid: false,
      action: '',
      meta: '',
    };
  }
}
