module ethos::ethos_example_coin {
    use std::option;
    use sui::coin::{Self, Coin, TreasuryCap};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;
    use sui::url;

    const IconUrl: vector<u8> = b"https://arweave.net/jlumw0-GYXXg8qgWd4q9v6vVVhmnon68nW8jzTDs584";

    struct ETHOS_EXAMPLE_COIN has drop {}

    fun init(witness: ETHOS_EXAMPLE_COIN, ctx: &mut TxContext) {
        let ascii_url = std::ascii::string(IconUrl);
        let icon_url = url::new_unsafe(ascii_url);
        let (treasury_cap, metadata) = coin::create_currency<ETHOS_EXAMPLE_COIN>(
            witness, 9, 
            b"EEC", 
            b"EthosExampleCoin", 
            b"An example coin made by Ethos", 
            option::some(icon_url), 
            ctx
        );
        transfer::public_freeze_object(metadata);
        transfer::public_share_object(treasury_cap);
    }

    public entry fun mint(treasury_cap: &mut TreasuryCap<ETHOS_EXAMPLE_COIN>, amount: u64, ctx: &mut TxContext) {
        coin::mint_and_transfer(treasury_cap, amount, tx_context::sender(ctx), ctx)
    }

    public entry fun burn(treasury_cap: &mut TreasuryCap<ETHOS_EXAMPLE_COIN>, coin: Coin<ETHOS_EXAMPLE_COIN>) {
        coin::burn(treasury_cap, coin);
    }
}