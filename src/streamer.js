const CCC = {};

CCC.STATIC=CCC.STATIC || {};

CCC.STATIC.TYPE={
    'TRADE'                  : '0'
  , 'FEEDNEWS'               : '1'
  , 'CURRENT'                : '2'
  , 'LOADCOMPLATE'           : '3'
  , 'COINPAIRS'              : '4'
  , 'CURRENTAGG'             : '5'
  , 'TOPLIST'                : '6'
  , 'TOPLISTCHANGE'          : '7'
  , 'ORDERBOOK'              : '8'
  , 'FULLORDERBOOK'          : '9'
  , 'ACTIVATION'             : '10'

  , 'TRADECATCHUP'           : '100'
  , 'NEWSCATCHUP'            : '101'
  
  , 'TRADECATCHUPCOMPLETE'   : '300'
  , 'NEWSCATCHUPCOMPLETE'    : '301'
  
};

CCC.STATIC.CURRENCY = CCC.STATIC.CURRENCY || {};

CCC.STATIC.CURRENCY.SYMBOL = {
	'BTC'  : 'Ƀ'
  , 'LTC'  : 'Ł'
  , 'DAO'  : 'Ð'
  , 'USD'  : '$'
  , 'CNY'  : '¥'
  , 'EUR'  : '€'
  , 'GBP'  : '£'
  , 'JPY'  : '¥'
  , 'PLN'  : 'zł'
  , 'RUB'  : '₽'
  , 'ETH'  : 'Ξ'
  , 'GOLD' : 'Gold g'
  , 'INR'  : '₹'
  , 'BRL'  : 'R$'
};

CCC.STATIC.CURRENCY.getSymbol = symbol => CCC.STATIC.CURRENCY.SYMBOL[symbol] || symbol;

CCC.STATIC.UTIL = {
	exchangeNameMapping : {
		'CCCAGG':'CryptoCompare Index',
		'BTCChina':'BTCC'
	},
	isMobile(userAgent) {
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) )
      return true;
		return false;
	},
	convertToMB(bytes) {
		return `${(parseInt(bytes,10)/1024/1024).toFixed(2)} MB`;
	},
	getNameForExchange(exchangeName) {
		if(this.exchangeNameMapping.hasOwnProperty(exchangeName)){
			return this.exchangeNameMapping[exchangeName];
		}
		return exchangeName;
	},
	noExponents(value) {
        const data= String(value).split(/[eE]/);
        if(data.length === 1) return data[0];

        let z= '';
        const sign= value<0? '-':'';
        const str= data[0].replace('.', '');
        let mag= Number(data[1])+ 1;

        if(mag<0){
			z= `${sign}0.`;
			while(mag++) z += '0';
			return z + str.replace(/^-/,'');
		}
        mag -= str.length;
        while(mag--) z += '0';
        return str + z;
    },
	reduceFloatVal(value) {
		value = parseFloat(value);
		if(value>1){
			value = Math.round(value * 100) / 100;
			return value;
		}
		if(value>=0.00001000){
		    return parseFloat(value.toPrecision(4));
        }
        if(value>=0.00000100){
		    return parseFloat(value.toPrecision(3));
        }
        if(value>=0.00000010){
		    return parseFloat(value.toPrecision(2));
        }
		return parseFloat(value.toPrecision(1));
    },
	reduceReal(value) {
        value = parseFloat(value);
		return parseFloat(value.toFixed(8));
    },
    convertCurrentKeyToAll(key) {
        const valuesArray = key.split("~");
        valuesArray[0]=CCC.STATIC.TYPE.CURRENTAGG;
        valuesArray[1]='CCCAGG';
        return valuesArray.join('~');
    },
	convertCurrentKeyToTrade(key) {
        const valuesArray = key.split("~");
        valuesArray[0]=CCC.STATIC.TYPE.TRADE;
    	return valuesArray.join('~');
    },
	convertValueToDisplay(symbol, value, filterNumberFunctionAngularJS, type, fullNumbers) {
		let prefix = '';
		let valueSign=1;
		value = parseFloat(value);
		let valueAbs=Math.abs(value);
		let decimalsOnBigNumbers = 2;
		let decimalsOnNormalNumbers = 2;
		let decimalsOnSmallNumbers = 4;
		if(fullNumbers===true){
			decimalsOnBigNumbers =2;
			decimalsOnNormalNumbers = 0;
			decimalsOnSmallNumbers= 4;
		}
		if(type === "8decimals"){
			decimalsOnBigNumbers =4;
			decimalsOnNormalNumbers = 8;
			decimalsOnSmallNumbers= 8;
			if(value<0.0001 && value>=0.00001){decimalsOnSmallNumbers=4;}
			if(value<0.001 && value>=0.0001){decimalsOnSmallNumbers=5;}
			if(value<0.01 && value>=0.001){decimalsOnSmallNumbers=6;}
			if(value<0.1 && value>=0.01){decimalsOnSmallNumbers=7;}
		}
		if(symbol!==''){prefix = `${symbol} `;}
		if(value<0){valueSign = -1;}
		if(value===0){return `${prefix}0`;}
		
		if(value<0.00001000 && value>=0.00000100 && decimalsOnSmallNumbers>3){
			decimalsOnSmallNumbers=3;
		}
		if(value<0.00000100 && value>=0.00000010 && decimalsOnSmallNumbers>2){
			decimalsOnSmallNumbers=2;
		}
		if(value<0.00000010 && decimalsOnSmallNumbers>1){
			decimalsOnSmallNumbers=1;
		}
		
		if(type==="short"||type==="8decimals"){
			if(valueAbs>10000000000){
				valueAbs=valueAbs/1000000000;
				return `${prefix+filterNumberFunctionAngularJS(valueSign*valueAbs,decimalsOnBigNumbers)} B`;
			}
			if(valueAbs>10000000){
				valueAbs=valueAbs/1000000;
				return `${prefix+filterNumberFunctionAngularJS(valueSign*valueAbs,decimalsOnBigNumbers)} M`;
			}
			if(valueAbs>10000){
				valueAbs=valueAbs/1000;
				return `${prefix+filterNumberFunctionAngularJS(valueSign*valueAbs,decimalsOnBigNumbers)} K`;
			}
			if(type==="8decimals" && valueAbs>=100){
				return prefix+filterNumberFunctionAngularJS(valueSign*valueAbs,decimalsOnBigNumbers);
			}
			if(valueAbs>=1){
				return prefix+filterNumberFunctionAngularJS(valueSign*valueAbs,decimalsOnNormalNumbers);
			}
			return prefix+(valueSign*valueAbs).toPrecision(decimalsOnSmallNumbers);
		}else{
			if(valueAbs>=1){
				return prefix+filterNumberFunctionAngularJS(valueSign*valueAbs,decimalsOnNormalNumbers);
			}
			
			return prefix+this.noExponents((valueSign*valueAbs).toPrecision(decimalsOnSmallNumbers));
		}
	}
};


CCC.TRADE=CCC.TRADE || {};
/*
trade fields binary values always in the last ~
*/

CCC.TRADE.FLAGS = {
    'SELL'       : 0x1 // hex for binary 1
  , 'BUY'        : 0x2 // hex for binary 10
  , 'UNKNOWN'    : 0x4 // hex for binary 100
}

CCC.TRADE.FIELDS = {
    'T'          : 0x0  // hex for binary 0, it is a special case of fields that are always there TYPE
  , 'M'          : 0x0  // hex for binary 0, it is a special case of fields that are always there MARKET
  , 'FSYM'       : 0x0  // hex for binary 0, it is a special case of fields that are always there FROM SYMBOL
  , 'TSYM'       : 0x0  // hex for binary 0, it is a special case of fields that are always there TO SYMBOL
  , 'F'          : 0x0  // hex for binary 0, it is a special case of fields that are always there FLAGS
  , 'ID'         : 0x1  // hex for binary 1                                                       ID
  , 'TS'         : 0x2  // hex for binary 10                                                      TIMESTAMP
  , 'Q'          : 0x4  // hex for binary 100                                                     QUANTITY
  , 'P'          : 0x8  // hex for binary 1000                                                    PRICE
  , 'TOTAL'      : 0x10 // hex for binary 10000                                                   TOTAL

};

CCC.TRADE.DISPLAY = CCC.TRADE.DISPLAY||{};
CCC.TRADE.DISPLAY.FIELDS = {
    'T'          : {"Show":false}
  , 'M'          : {"Show":true, 'Filter':'Market'}
  , 'FSYM'       : {"Show":true, 'Filter':'CurrencySymbol'}
  , 'TSYM'       : {"Show":true, 'Filter':'CurrencySymbol'}
  , 'F'          : {"Show":true, 'Filter':'TradeFlag'}
  , 'ID'         : {"Show":true, 'Filter':'Text'}
  , 'TS'         : {'Show':true, 'Filter':'Date'  , 'Format':'yyyy MMMM dd HH:mm:ss'}
  , 'Q'          : {'Show':true, 'Filter':'Number', 'Symbol':'FSYM'}
  , 'P'          : {'Show':true, 'Filter':'Number', 'Symbol':'TSYM'}
  , 'TOTAL'      : {'Show':true, 'Filter':'Number', 'Symbol':'TSYM'}

};

CCC.TRADE.pack = function(tradeObject){
    let mask = 0;
    let packedTrade ='';
    for (const field in tradeObject) {
        packedTrade += `~${tradeObject[field]}`;
        mask|=this.FIELDS[field];
    }
    return `${packedTrade.substr(1)}~${mask.toString(16)}`;
};

CCC.TRADE.unpack = function(tradeString){
    const valuesArray = tradeString.split("~");
    const valuesArrayLenght = valuesArray.length;
    const mask = valuesArray[valuesArrayLenght-1];
    const maskInt = parseInt(mask,16);
    const unpackedTrade = {};
    let currentField = 0;
    for(const property in this.FIELDS){
        if(this.FIELDS[property] === 0)
        {
            unpackedTrade[property] = valuesArray[currentField];
            currentField++;
        }
        else if(maskInt&this.FIELDS[property])
        {
            unpackedTrade[property] = valuesArray[currentField];
            currentField++;
        }
    }
    
    return unpackedTrade;
}

CCC.TRADE.getKey = tradeObject => `${tradeObject['T']}~${tradeObject['M']}~${tradeObject['FSYM']}~${tradeObject['TSYM']}`;

CCC.CURRENT=CCC.CURRENT || {};
/*
current fields mask values always in the last ~
*/

CCC.CURRENT.FLAGS = {
    'PRICEUP'        : 0x1    // hex for binary 1
  , 'PRICEDOWN'      : 0x2    // hex for binary 10
  , 'PRICEUNCHANGED' : 0x4    // hex for binary 100
  , 'BIDUP'          : 0x8    // hex for binary 1000
  , 'BIDDOWN'        : 0x10   // hex for binary 10000
  , 'BIDUNCHANGED'   : 0x20   // hex for binary 100000
  , 'OFFERUP'        : 0x40   // hex for binary 1000000
  , 'OFFERDOWN'      : 0x80   // hex for binary 10000000
  , 'OFFERUNCHANGED' : 0x100  // hex for binary 100000000
  , 'AVGUP'          : 0x200  // hex for binary 1000000000
  , 'AVGDOWN'        : 0x400  // hex for binary 10000000000
  , 'AVGUNCHANGED'   : 0x800  // hex for binary 100000000000
};


CCC.CURRENT.FIELDS={
    'TYPE'            : 0x0       // hex for binary 0, it is a special case of fields that are always there
  , 'MARKET'          : 0x0       // hex for binary 0, it is a special case of fields that are always there
  , 'FROMSYMBOL'      : 0x0       // hex for binary 0, it is a special case of fields that are always there
  , 'TOSYMBOL'        : 0x0       // hex for binary 0, it is a special case of fields that are always there
  , 'FLAGS'           : 0x0       // hex for binary 0, it is a special case of fields that are always there
  , 'PRICE'           : 0x1       // hex for binary 1
  , 'BID'             : 0x2       // hex for binary 10
  , 'OFFER'           : 0x4       // hex for binary 100
  , 'LASTUPDATE'      : 0x8       // hex for binary 1000
  , 'AVG'             : 0x10      // hex for binary 10000
  , 'LASTVOLUME'      : 0x20      // hex for binary 100000
  , 'LASTVOLUMETO'    : 0x40      // hex for binary 1000000
  , 'LASTTRADEID'     : 0x80      // hex for binary 10000000
  , 'VOLUMEHOUR'      : 0x100     // hex for binary 100000000
  , 'VOLUMEHOURTO'    : 0x200     // hex for binary 1000000000
  , 'VOLUME24HOUR'    : 0x400     // hex for binary 10000000000
  , 'VOLUME24HOURTO'  : 0x800     // hex for binary 100000000000
  , 'OPENHOUR'        : 0x1000    // hex for binary 1000000000000
  , 'HIGHHOUR'        : 0x2000    // hex for binary 10000000000000
  , 'LOWHOUR'         : 0x4000    // hex for binary 100000000000000
  , 'OPEN24HOUR'      : 0x8000    // hex for binary 1000000000000000
  , 'HIGH24HOUR'      : 0x10000   // hex for binary 10000000000000000
  , 'LOW24HOUR'       : 0x20000   // hex for binary 100000000000000000
  , 'LASTMARKET'      : 0x40000   // hex for binary 1000000000000000000, this is a special case and will only appear on CCCAGG messages
};

CCC.CURRENT.DISPLAY = CCC.CURRENT.DISPLAY||{};
CCC.CURRENT.DISPLAY.FIELDS={
	'TYPE'            : {'Show':false}
  , 'MARKET'          : {'Show':true, 'Filter':'Market'}
  , 'FROMSYMBOL'      : {'Show':false}
  , 'TOSYMBOL'        : {'Show':false}
  , 'FLAGS'           : {'Show':false}
  , 'PRICE'           : {'Show':true, 'Filter':'Number', 'Symbol':'TOSYMBOL'}
  , 'BID'             : {'Show':true, 'Filter':'Number', 'Symbol':'TOSYMBOL'}
  , 'OFFER'           : {'Show':true, 'Filter':'Number', 'Symbol':'TOSYMBOL'}
  , 'LASTUPDATE'      : {'Show':true, 'Filter':'Date'  , 'Format':'yyyy MMMM dd HH:mm:ss'}
  , 'AVG'             : {'Show':true,' Filter':'Number', 'Symbol':'TOSYMBOL'}
  , 'LASTVOLUME'      : {'Show':true, 'Filter':'Number', 'Symbol':'FROMSYMBOL'}
  , 'LASTVOLUMETO'    : {'Show':true, 'Filter':'Number', 'Symbol':'TOSYMBOL'}
  , 'LASTTRADEID'     : {'Show':true, 'Filter':'String'}
  , 'VOLUMEHOUR'      : {'Show':true, 'Filter':'Number', 'Symbol':'FROMSYMBOL'}
  , 'VOLUMEHOURTO'    : {'Show':true, 'Filter':'Number', 'Symbol':'TOSYMBOL'}
  , 'VOLUME24HOUR'    : {'Show':true, 'Filter':'Number', 'Symbol':'FROMSYMBOL'}
  , 'VOLUME24HOURTO'  : {'Show':true, 'Filter':'Number', 'Symbol':'TOSYMBOL'}
  , 'OPENHOUR'        : {'Show':true, 'Filter':'Number', 'Symbol':'TOSYMBOL'}
  , 'HIGHHOUR'        : {'Show':true, 'Filter':'Number', 'Symbol':'TOSYMBOL'}
  , 'LOWHOUR'         : {'Show':true, 'Filter':'Number', 'Symbol':'TOSYMBOL'}
  , 'OPEN24HOUR'      : {'Show':true, 'Filter':'Number', 'Symbol':'TOSYMBOL'}
  , 'HIGH24HOUR'      : {'Show':true, 'Filter':'Number', 'Symbol':'TOSYMBOL'}
  , 'LOW24HOUR'       : {'Show':true, 'Filter':'Number', 'Symbol':'TOSYMBOL'}
  , 'LASTMARKET'      : {'Show':true, 'Filter':'String'}
};

CCC.CURRENT.pack = function(currentObject)
{
    let mask = 0;
    let packedCurrent ='';
    for(const property in this.FIELDS)
    {
        if(currentObject.hasOwnProperty(property)){
            packedCurrent += `~${currentObject[property]}`;
            mask|=this.FIELDS[property];
        }
    }
    //removing first character beacsue it is a ~
    return `${packedCurrent.substr(1)}~${mask.toString(16)}`;
};

CCC.CURRENT.unpack = function(value)
{
    const valuesArray = value.split("~");
    const valuesArrayLenght = valuesArray.length;
    const mask = valuesArray[valuesArrayLenght-1];
    const maskInt = parseInt(mask,16);
    const unpackedCurrent = {};
    let currentField = 0;
    for(const property in this.FIELDS)
    {
        if(this.FIELDS[property] === 0)
        {
            unpackedCurrent[property] = valuesArray[currentField];
            currentField++;
        }
        else if(maskInt&this.FIELDS[property])
        {
			//i know this is a hack, for cccagg, future code please don't hate me:(, i did this to avoid
			//subscribing to trades as well in order to show the last market
         	if(property === 'LASTMARKET'){
                unpackedCurrent[property] = valuesArray[currentField];
            }else{
                 unpackedCurrent[property] = parseFloat(valuesArray[currentField]);
            }
            currentField++;
        }
    }
    
    return unpackedCurrent;
};
CCC.CURRENT.getKey = currentObject => `${currentObject['TYPE']}~${currentObject['MARKET']}~${currentObject['FROMSYMBOL']}~${currentObject['TOSYMBOL']}`;
CCC.CURRENT.getKeyFromStreamerData = streamerData => {
	const valuesArray = streamerData.split("~");
    return `${valuesArray[0]}~${valuesArray[1]}~${valuesArray[2]}~${valuesArray[3]}`;
};

CCC.noExponents = value => {
    const data= String(value).split(/[eE]/);
    if(data.length === 1) return data[0];

    let z= '';
    const sign= value<0? '-':'';
    const str= data[0].replace('.', '');
    let mag= Number(data[1])+ 1;

    if(mag<0){
      z= `${sign}0.`;
      while(mag++) z += '0';
      return z + str.replace(/^-/,'');
    }
    mag -= str.length;
    while(mag--) z += '0';
    return str + z;
};

CCC.filterNumberFunctionPolyfill = (value, decimals) => {
  const decimalsDenominator = 10 ** decimals;
  const numberWithCorrectDecimals = Math.round(value*decimalsDenominator)/decimalsDenominator;
  const parts = numberWithCorrectDecimals.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}

CCC.convertValueToDisplay =  (symbol, value, type, fullNumbers) => {
    let prefix = '';
    let valueSign=1;
    value = parseFloat(value);
    let valueAbs=Math.abs(value);
    let decimalsOnBigNumbers = 2;
    let decimalsOnNormalNumbers = 2;
    let decimalsOnSmallNumbers = 4;
    if(fullNumbers===true){
      decimalsOnBigNumbers =2;
      decimalsOnNormalNumbers = 0;
      decimalsOnSmallNumbers= 4;
    }
    if(symbol!==''){
      prefix = `${symbol} `;
    }
    if(value<0){
      valueSign = -1;
    }
    
    if(value === 0){
      return `${prefix}0`;
    }
    
    if(value<0.00001000 && value>=0.00000100 && decimalsOnSmallNumbers>3){
      decimalsOnSmallNumbers=3;
    }
    if(value<0.00000100 && value>=0.00000010 && decimalsOnSmallNumbers>2){
      decimalsOnSmallNumbers=2;
    }
    if(value<0.00000010 && value>=0.00000001 && decimalsOnSmallNumbers>1){
      decimalsOnSmallNumbers=1;
    }
    
    if(type === "short"){
      if(valueAbs>10000000000){
        valueAbs=valueAbs/1000000000;
        return `${prefix+CCC.filterNumberFunctionPolyfill(valueSign*valueAbs,decimalsOnBigNumbers)} B`;
      }
      if(valueAbs>10000000){
        valueAbs=valueAbs/1000000;
        return `${prefix+CCC.filterNumberFunctionPolyfill(valueSign*valueAbs,decimalsOnBigNumbers)} M`;
      }
      if(valueAbs>10000){
        valueAbs=valueAbs/1000;
        return `${prefix+CCC.filterNumberFunctionPolyfill(valueSign*valueAbs,decimalsOnBigNumbers)} K`;
      }
      if(valueAbs>=1){
        return prefix+CCC.filterNumberFunctionPolyfill(valueSign*valueAbs,decimalsOnNormalNumbers);
      }
      return prefix+(valueSign*valueAbs).toPrecision(decimalsOnSmallNumbers);
    }else{
      if(valueAbs>=1){
        return prefix+CCC.filterNumberFunctionPolyfill(valueSign*valueAbs,decimalsOnNormalNumbers);
      }
      
      return prefix+CCC.noExponents((valueSign*valueAbs).toPrecision(decimalsOnSmallNumbers));
    }
  };

export default CCC;