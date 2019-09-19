# waste-management-using-blockchain

In this project it is assumed that the manure contributers give the manure bags at a common place.<br/>
This place has a manure collector and a manure collection machine.<br/>
The machine has slots to insert id cards of sender and reciever, barcode sticker generator, barcode scanner and a digital weighing scale and weight right light.<br/>
If mode is set to new then, collector inserts his id card and places the manure bag on the machine, then a barcode sticker is generated. This is glued onto the manure bag. The machine automatically creates a blockchain entry based on the manure bag weight and by considering the owner as the collector.<br/>
If mode is set to trade then, collector and framer insert their cards in the machine, the collector scans the barcode on the manure bag. Based on the weight threshold the weight-right light glows and the farmer either takes the manure bag or asks for another manure bag since there is some mismatch in the weight.
