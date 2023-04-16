use anchor_lang::prelude::*;
use anchor_spl::{
    token,
    token::{Token, Burn, MintTo, mint_to},
};

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod test {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        
        Ok(())
    }

    pub fn mint(ctx: Context<Mint>, amount: u64) -> Result<()> {
        // let user = &mut ctx.accounts.user;

        let cpi_accounts = MintTo {
            mint: ctx.accounts.mint.to_account_info(),
            to: ctx.accounts.token_account.to_account_info(),
            authority: ctx.accounts.authority.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        // Create the CpiContext we need for the request
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);

        // Execute anchor's helper function to mint tokens
        mint_to(cpi_ctx, amount)?;
        
        Ok(())
    }

    pub fn redeem(ctx: Context<Redeem>, amount: u64) -> Result<()> {
        // let user = &mut ctx.accounts.user;

        let cpi_accounts = Burn {
            mint: ctx.accounts.mint.to_account_info(),
            from: ctx.accounts.from.to_account_info(),
            authority: ctx.accounts.authority.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        // Create the CpiContext we need for the request
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);

        // Execute anchor's helper function to burn tokens
        token::burn(cpi_ctx, amount)?;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}

#[derive(Accounts)]
pub struct Mint<'info> {
    #[account(mut)]
    pub mint: Account<'info, anchor_spl::token::Mint>,
    pub token_program: Program<'info, Token>,
    /// CHECK: This is the token account that we want to mint tokens to
    #[account(mut)]
    pub token_account: AccountInfo<'info>,
    /// CHECK: the authority of the mint account
    pub authority: Signer<'info>,  
}

#[derive(Accounts)]
pub struct Redeem<'info> {
    #[account(mut)]
    pub mint: Account<'info, anchor_spl::token::Mint>,
    pub token_program: Program<'info, Token>,
    /// CHECK: This is the token account that we want to mint tokens to
    #[account(mut)]
    pub from: AccountInfo<'info>,
    /// CHECK: the authority of the mint account
    pub authority: Signer<'info>,
}