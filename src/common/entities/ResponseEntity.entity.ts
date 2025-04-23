export class ResponseEntity {

    constructor(private data: any = null, private messages: string[] = []){}


    static success(data: any): ResponseEntity {
        return new ResponseEntity(data)
    }

    static error(msg: string[]): ResponseEntity {
        return new ResponseEntity(null, msg)
    }

    hasMessage(): boolean {
        return this.messages.length != 0 ? true : false
    }

    addMsg(msg: string) {
        this.messages.push(msg);
        return this;
    }

    setMsg(msgs: string[]) {
        this.messages = msgs;
        return this;
    }

    setData(data: any) {
        this.data = data;
        return this;
    }
}