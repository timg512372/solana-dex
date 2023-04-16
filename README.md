# SolStash 🔄 LionHack 2023

> Invest in the future of Solana — the FIRST Solana-native ETF exchange that lets users trade SOL coins for a whole "stash" of assets in just 3 clicks!

More information can be found in our `README.md` in the docs folder and the following links!

- [LionHack Post](https://devfolio.co/projects/solstash-ccef)

- [YouTube Demo](https://www.youtube.com/watch?v=Dmht2lt_WXQ)

- [Slide Deck](https://docs.google.com/presentation/d/1fJN_g5Hkz8mEg4Fkyc2mAPWAai-GO0NWTe3T818-Yyc/edit?usp=sharing)
<br/><br/>

# Description
## 🌸 The Problem SolStash Solves
Exchange traded funds (ETF's) are investment funds containing baskets of many different assets and are traded on exchanges like stocks. They offer investors exposure to a diverse range of assets with lower fees and better liquidity than traditional mutual funds.

There are several benefits to offering a Solana ETF. Firstly, it would provide investors with a convenient and cost-effective way to invest in Solana, as opposed to buying and holding the underlying asset directly. Additionally, an ETF could potentially attract more institutional investors who may not be able to invest in individual cryptocurrencies due to regulatory restrictions or risk management policies.

Furthermore, a Solana ETF could help to increase liquidity in the market, which could lead to more efficient price discovery and reduce the risk of price manipulation. This, in turn, could help to increase investor confidence in the Solana ecosystem and attract more capital to the network.

Finally, offering a Solana ETF could help to diversify the Solana investment landscape by providing exposure to a range of different projects and assets within the Solana ecosystem. This could help to mitigate the risk of investing in a single Solana-based asset or project and provide investors with a more balanced and diversified investment portfolio.

SolStash is first solana-native ETF platform that allows users to buy and sell ETF's on Solana. Offering easy wallet integration and a user-friendly interface. The program will provide users with real-time market data and advanced trading tools, such as limit and stop-loss orders, to help them make informed investment decisions.

In summary, the program developed by our team provides users with a fast, cheap, and accessible way to trade ETF's on Solana. By leveraging Solana's smarts we are able to create more complex trading strategies to provide users with more diversity in their portfolios.
<br /><br />
## 🔨 Architecture
We split our group into 2 teams, each focusing on a specific component of the project!

**Frontend (React, TailWindCSS, Phantom Wallet Integration)**:  
- Calls smart contract with Anchor
- Data caching and rebalancing

**🔙 Backend (Node.js, Orca, Solana)**:   
- Contract deployed to Devnet
- Minting, burning, and swaps
- Orca is our swap provider

<br />  
## 🚧 Challenges we ran into
A recurring challenge that we faced when building SolStash was the lack of clear documentation among Solana projects. In our quest to find a viable AMM that could faciliate the trades for our ETF, we tried Radium's SDK, Radium's contract, Orca's contracts, and the Solana native token-swap protocol before we finally managed to get Orca's price SDK to work. Often times, we would encounter strange bugs with cryptic issues.

Similarly, we intented to run an oracle to feed price data into our smart contract for better rebalancing, but that didn't end up coming to fruition becuase there were no working examples or instructions on how to integrate oracles with Solana.
