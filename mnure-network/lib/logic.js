/**
 * Track the trade of a commodity from one trader to another
 * @param {org.example.mynetwork.Trade} trade - the trade to be processed
 * @transaction
 */
async function tradeCommodity(trade) {
    if(trade.manure.owner.role!=trade.newOwner.role) {
      trade.manure.owner = trade.newOwner;
      let assetRegistry = await getAssetRegistry('org.example.mynetwork.Manure');
      await assetRegistry.update(trade.manure);
  } else {
      let assetRegistry = await getAssetRegistry('org.example.mynetwork.Manure');
      await assetRegistry.update(trade.manure);
  }
}