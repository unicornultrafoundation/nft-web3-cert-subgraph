import {Item, User} from "../generated/schema";
import {Transfer, URC721} from "../generated/NFTItem/URC721";
import {ContractAddress} from "./const";

export function handleTransfer(event: Transfer): void {
  /* load the token from the existing Graph Node */

  let token = Item.load(event.params.tokenId.toString())
  if (!token) {
    token = new Item(event.params.tokenId.toString())
    token.tokenID = event.params.tokenId
    token.tokenURI = ""
    let nftContract = URC721.bind(ContractAddress)
    let tokenURIResult = nftContract.try_tokenURI(token.tokenID)
    if (!tokenURIResult.reverted) {
      token.tokenURI = tokenURIResult.value;
    }
  }

  token.owner = event.params.to.toHexString()
  token.save()

  let user = User.load(event.params.to.toHexString())
  if (!user) {
    user = new User(event.params.to.toHexString())
    user.save()
  }
}


