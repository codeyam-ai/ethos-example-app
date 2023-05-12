module ethos::ethos_example_nft {
    use sui::url::{Self, Url};
    use std::string::{utf8, String};
    use sui::object::{Self, ID, UID};
    use sui::event;
    use sui::transfer::{public_transfer};
    use sui::tx_context::{sender, Self, TxContext};

    use sui::package;
    use sui::display;

    const FEE: u64 = 50000;
    
    const EInvalidFee: u64 = 0;

    struct EthosNFT has key, store {
        id: UID,
        name: String,
        description: String,
        url: Url,
    }

    /// One-Time-Witness for the module.
    struct ETHOS_EXAMPLE_NFT has drop {}

    // ===== Events =====

    struct NFTMinted has copy, drop {
        // The Object ID of the NFT
        object_id: ID,
        // The creator of the NFT
        creator: address,
        // The name of the NFT
        name: String,
    }

    // ===== Public view functions =====

    /// Get the NFT's `name`
    public fun name(nft: &EthosNFT): &String {
        &nft.name
    }

    /// Get the NFT's `description`
    public fun description(nft: &EthosNFT): &String {
        &nft.description
    }

    /// Get the NFT's `url`
    public fun url(nft: &EthosNFT): &Url {
        &nft.url
    }

    fun init(otw: ETHOS_EXAMPLE_NFT, ctx: &mut TxContext) {
        let keys = vector[
            utf8(b"name"),
            utf8(b"image_url"),
            utf8(b"description"),
            utf8(b"project_url"),
            utf8(b"creator"),
        ];

        let values = vector[
            utf8(b"{name}"),
            utf8(b"{url}"),
            utf8(b"{description}"),
            utf8(b"https://ethos-example-app.onrender.com/"),
            utf8(b"Ethos")
        ];

        // Claim the `Publisher` for the package!
        let publisher = package::claim(otw, ctx);

        // Get a new `Display` object for the `Hero` type.
        let display = display::new_with_fields<EthosNFT>(
            &publisher, keys, values, ctx
        );

        // Commit first version of `Display` to apply changes.
        display::update_version(&mut display);

        public_transfer(publisher, sender(ctx));
        public_transfer(display, sender(ctx));
    }

    // ===== Entrypoints =====

    /// Create a new ethos nft
    public entry fun mint_to_sender(
        name: vector<u8>,
        description: vector<u8>,
        url: vector<u8>,
        ctx: &mut TxContext
    ) {
        let sender = sender(ctx);
        let nft = mint(name, description, url, ctx);
        public_transfer(nft, sender);
    }


    /// Transfer `nft` to `recipient`
    public entry fun transfer(
        nft: EthosNFT, recipient: address, _: &mut TxContext
    ) {
        public_transfer(nft, recipient)
    }

    /// Update the `description` of `nft` to `new_description`
    public entry fun update_description(
        nft: &mut EthosNFT,
        new_description: vector<u8>,
        _: &mut TxContext
    ) {
        nft.description = utf8(new_description)
    }

    /// Permanently delete `nft`
    public entry fun burn(nft: EthosNFT, _: &mut TxContext) {
        let EthosNFT { id, name: _, description: _, url: _ } = nft;
        object::delete(id)
    }

    public fun mint(
        name: vector<u8>,
        description: vector<u8>,
        url: vector<u8>,
        ctx: &mut TxContext
    ): EthosNFT {
        let sender = tx_context::sender(ctx);

        let nft = EthosNFT {
            id: object::new(ctx),
            name: utf8(name),
            description: utf8(description),
            url: url::new_unsafe_from_bytes(url)
        };

        event::emit(NFTMinted {
            object_id: object::id(&nft),
            creator: sender,
            name: nft.name,
        });

        nft
    }
}
