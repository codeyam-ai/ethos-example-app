module ethos::example {
    use std::string::{Self, String};
    use sui::object::{Self, UID};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;

    struct EthosExample has key, store {
        id: UID,
        name: String,
        description: String,
        message: String,
        url: String
    }

    public entry fun mint(ctx: &mut TxContext) {
        let message = string::utf8(b"Hey there!");
        let ethos_example = new(message, ctx);
        transfer::transfer(ethos_example, tx_context::sender(ctx));
    }

    public entry fun modify(ethos_example: &mut EthosExample, new_message: vector<u8>) {
        ethos_example.message = string::utf8(new_message);
        ethos_example.url = url(ethos_example.message);
    }

    public entry fun burn(ethos_example: EthosExample) {
        let EthosExample { id, name: _, description: _, message: _, url: _ } = ethos_example;
        object::delete(id);
    }

    public entry fun transfer(ethos_example: EthosExample, recipient: address) {
        transfer::transfer(ethos_example, recipient);
    }

    public entry fun clone(ethos_example: &EthosExample, ctx: &mut TxContext) {
        let cloned_ethos_example = new(ethos_example.message, ctx);
        transfer::transfer(cloned_ethos_example, tx_context::sender(ctx));
    }

    fun new(message: String, ctx: &mut TxContext): EthosExample {
         EthosExample {
            id: object::new(ctx),
            name: string::utf8(b"Ethos Example"),
            description: string::utf8(b"An example Sui object build by Ethos"),
            message,
            url: url(message)
        }
    }

    fun url(message: String): String {
        let start = string::utf8(b"data:image/svg+xml;utf8,%3Csvg width='150' height='150' viewBox='0 0 150 150' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg%3E%3Cpath d='M75 0L91.7327 12.5529L112.5 10.0481L120.714 29.2855L139.952 37.5L137.447 58.2673L150 75L137.447 91.7327L139.952 112.5L120.714 120.714L112.5 139.952L91.7327 137.447L75 150L58.2673 137.447L37.5 139.952L29.2855 120.714L10.0481 112.5L12.5529 91.7327L0 75L12.5529 58.2673L10.0481 37.5L29.2855 29.2855L37.5 10.0481L58.2673 12.5529L75 0Z' fill='%231100D2'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='center' text-anchor='middle' fill='white'%3E ");
        let end = string::utf8(b" %3C/text%3E%3C/g%3E%3C/svg%3E%0A");
        string::append(&mut start, message);
        string::append(&mut start, end);
        start
    }
}