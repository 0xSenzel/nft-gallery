import NFTCard from "../components/nftCard";
import { useEffect, useState } from 'react';

const Home = () => {
  const [wallet, setWalletAddress] = useState("");
  const [collection, setCollectionAddress] = useState("");
  const [NFTs, setNFTs] = useState([]);
  const [fetchForCollection, setFetchForCollection] = useState(false);
  const [startToken, setStartToken] = useState(0);
  const [previousToken, setPreviousToken]=useState(0)
  const [nextToken, setNextToken]=useState(100)
  const [pageCount, setPageCount] = useState('')

  const fetchNFTsOfOwners = async () => {
    let nfts;
    console.log("fetching nfts");
    
    const baseURL = `https://eth-mainnet.alchemyapi.io/v2/${process.env.NEXT_PUBLIC_API_KEY}/getNFTs/`;

    if (!collection.length) {
      var requestOptions = {
        method: 'GET'
      };

      const fetchURL = `${baseURL}?owner=${wallet}`;

      nfts = await fetch(fetchURL, requestOptions).then(data => data.json())
    } else {
      console.log("fetching nfts for collection owned by address");
      // The "5B%5D" string right after the "contractAddresses" parameters specifies that the "contractAddresses" 
      // parameter is an array and not a simple string. This is because you could actually filter by multiple "contractAddresses", 
      // not just one.
      const fetchURL = `${baseURL}?owner=${wallet}&contractAddress%5B%5D=${collection}`;
      nfts = await fetch(fetchURL, requestOptions).then(data => data.json());
    }

    if (nfts) {
      console.log("nfts:", NFTs);
      setNFTs(nfts.ownedNfts);
    }
  }

  const fetchNFTsForCollection = async () => {
    if (collection.length) {
      var requestOptions = {
        method: 'GET'
      };
      
      const baseURL = `https://eth-mainnet.alchemyapi.io/v2/${process.env.NEXT_PUBLIC_API_KEY}/getNFTsForCollection/`;
      
      const fetchURL = `${baseURL}?contractAddress=${collection}&withMetadata=${"true"}&startToken=${startToken}`;
      const nfts = await fetch(fetchURL, requestOptions).then(data => data.json())

      if (nfts) {
        console.log("NFTs in collection:", nfts);

        setNFTs(nfts.nfts);
        setPageCount(1);
        console.log("Previous Token #:",previousToken);
        console.log("Next Token #:", nextToken);
        
      }
    }
  }

  const handlePreviousPageChange = async () => {
    var requestOptions = {
      method: 'GET'
    };
    
    const baseURL = `https://eth-mainnet.alchemyapi.io/v2/${process.env.NEXT_PUBLIC_API_KEY}/getNFTsForCollection/`;
    
    const fetchURL = `${baseURL}?contractAddress=${collection}&withMetadata=${"true"}&startToken=${previousToken}`;
    const nfts = await fetch(fetchURL, requestOptions).then(data => data.json())

    if (nfts) {
      console.log("NFTs in Collection:", nfts.nfts);

      setNFTs(nfts.nfts);
      setPageCount(pageCount - 1)
      setNextToken(parseInt(nfts.nextToken) - 100);
      setPreviousToken(parseInt(nfts.nextToken) - 200);

      console.log("Previous Token #:",previousToken);
      console.log("Next Token #:", nextToken);
    }
  }

  const handleNextPageChange = async () => {
    var requestOptions = {
      method: 'GET'
    };
    
    const baseURL = `https://eth-mainnet.alchemyapi.io/v2/${process.env.NEXT_PUBLIC_API_KEY}/getNFTsForCollection/`;
    
    const fetchURL = `${baseURL}?contractAddress=${collection}&withMetadata=${"true"}&startToken=${nextToken}`;
    const nfts = await fetch(fetchURL, requestOptions).then(data => data.json())

    if (nfts) {
      console.log("NFTs in Collection:", nfts.nfts);

      setNFTs(nfts.nfts);
      setPageCount(pageCount + 1);
      setNextToken(parseInt(nfts.nextToken));
      setPreviousToken(parseInt(nfts.nextToken) - 100);
      
      console.log("Previous Token #:", previousToken);
      console.log("Next Token #:", nextToken);
    }
  }
  

  return (
    <div className="flex flex-col items-center justify-center py-8 gap-y-3">
      <div className="flex flex-col w-full justify-center items-center gap-y-2">
        <input disabled={fetchForCollection} className="w-2/5 bg-slate-100 py-2 px-2 rounded-lg text-gray-800 focus:outline-blue-300 disabled:bg-slate-50 disabled:text-gray-50" onChange={(e) => { setWalletAddress(e.target.value) }} value={wallet} type={"text"} placeholder="Add your wallet address"></input>
        <input className="w-2/5 bg-slate-100 py-2 px-2 rounded-lg text-gray-800 focus:outline-blue-300 disabled:bg-slate-50 disabled:text-gray-50" onChange={(e) => { setCollectionAddress(e.target.value) }} value={collection} type={"text"} placeholder="Add the collection address"></input>
        <label className="text-gray-600"><input onChange={(e) => { setFetchForCollection(e.target.checked) }} type={"checkbox"} className="mr-2"></input>Fetch for collection</label>
        <button className={"disabled: bg-slate-500 text-white bg-blue-400 px-4 py-2 mt-3 rounded-sm w-1/5"} onClick={
          () => {
            if (fetchForCollection) {
              fetchNFTsForCollection()
            } else fetchNFTsOfOwners()
          }
        }>Let's Go!</button>
      </div>

      <div className='flex flex-wrap gap-y-12 mt-4 w-5/6 gap-x-2 justify-center'>
        {
          NFTs.length && NFTs.map(nft => {
            return (
              <NFTCard nft={nft}></NFTCard>
            )
          })
        }
      </div>
      <div>
      <button className="px-2" 
        onClick={handlePreviousPageChange} 
        >
          {"< Previous"}
        </button>
        <span> {pageCount} </span>
        <button className="px-4" 
          onClick={handleNextPageChange} 
        >
          {"Next >"}
        </button>
      </div>
        
    </div>
  )
}

export default Home