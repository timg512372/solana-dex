use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod SolStash {
    use super::*;
    pub mut composition: HashMap<Pubkey, i32>; // composition of tokens
    pub mut total_amt: int; // ownership of tokens

    pub fn initialize(ctx: Context<Initialize>, _composition: HashMap<Pubkey, i32>) -> Result<()> {
        composition = _composition; 

        Ok(())
    }

    pub fn mint(ctx: Context<Mint>, origin_token: PubKey, amount: u64) -> Result<()> {
        let user = &mut ctx.accounts.user;
        let user_balance = user.amount; 
        require!(amount <= user_balance, ErrorCode::NotEnoughBalance); // ensure enough balance 

        // swap origin_token into tokens in composition based on weights
        let tx_amt = amount * originprice / totalprice; // get price of current basket
        composition.map(|token, weight| {
            // swap origin_token into token based on weight
            if (origin_token != token) {
                let exchange_addr = find_exchange_account(&token);
                let exchange = &mut ctx.accounts.exchange;
                exchange.swap(origin_token, token, amount * weight);
            }
        });

        // mint corresponding token to user
        token.mint(user, token_amt);

        Ok(())
    }

    pub fn redeem(ctx: Context<redeem>, target_token: PubKey, amount: u64) -> Result<()> {
        let user = &mut ctx.accounts.user;
        let user_balance = user.amount; 
        require!(amount <= user_balance, ErrorCode::NotEnoughBalance); // ensure enough balance 

        // swap tokens in composition into target_token based on weights
        let tx_amt = amount * originprice / totalprice; // get price of current basket
        composition.map(|token, weight| {
            // swap token into target_token based on weight
            if (target_token != token) {
                let exchange_addr = find_exchange_account(&token);
                let exchange = &mut ctx.accounts.exchange;
                exchange.swap(token, target_token, amount * weight);
            }
        });

        // burn corresponding token from user
        token.burn(user, token_amt);

        Ok(())
    }
}

#[derive(Accounts)]
pub struct SetData<'info> {
    #[account(mut)]
    pub user: Account<'info, Data>,
}
