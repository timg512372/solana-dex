use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod aggregator {
    // send orders with the best ratio / execution price to exchanges 
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }

    pub fn set_data(ctx: Context<SetData>, data: u64) -> Result<()> {
        let user = &mut ctx.accounts.user;
        user.data = data;
        
        Ok(())
    }

    pub fn single_exchange_route(ctx: Context<SingleExchangeRoute>, exchange: Pubkey, token_a: Pubkey, token_b: Pubkey, amount: u64) -> Result<()> {
        let user = &mut ctx.accounts.user;
        let user_balance = user.amount; 
        require!(amount <= user_balance, ErrorCode::NotEnoughBalance); // ensure enough balance 

        user.data = amount;
        let exchange_addr = Pubkey::from_str(exchange).unwrap();

        let test1 = find_metadata_account(&exchange_addr);
        println!("metadata_account => {:?}", exchange_addr);

        let test2 = find_master_edition_account(&exchange_addr);
        println!("master_edition => {:?}", exchange_addr);


        Ok(())
    }

    pub fn multi_exchange_route(ctx: Context<MultiExchangeRoute>, exchanges: &[Pubkey; 2], token_a: Pubkey, token_b: Pubkey, amount: u64) -> Result<()> {
        let user = &mut ctx.accounts.user;
        let user_balance = user.amount; 
        require!(amount <= user_balance, ErrorCode::NotEnoughBalance); // ensure enough balance 
        
        user.data = amount;
        let exchange_addr = Pubkey::from_str(exchanges[0].unwrap()).unwrap();
        let exchange_addr2 = Pubkey::from_str(exchanges[1].unwrap()).unwrap();

        Ok(())
    }
}

#[derive(Accounts)]
pub struct SetData<'info> {
    #[account(mut)]
    pub user: Account<'info, Data>,
}
