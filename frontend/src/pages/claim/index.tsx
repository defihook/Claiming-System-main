import { getParsedNftAccountsByOwner } from "@nfteyez/sol-rayz";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { useEffect, useState } from "react";
import NFTCard from "../../components/NFTCard";
import { CREATOR_ADDRESS, CREATOR_ADDRESS_SECOND } from "../../config";
import { airdrop, claim, getAirdropState } from "../../contexts/transaction";
import { AirdropProof } from "../../contexts/type";
import {
  solConnection,
  getTokenBalance,
  getMintDate,
  getNftMetaData,
  getTier,
  getNetworkTime,
} from "../../contexts/utils";
import { useRouter } from "next/router";
import { errorAlert, infoAlert } from "../../components/toastGroup";

export interface FoxTypes {
  mint: string;
  image: string;
  name: string;
  tier: string;
  mintDate: number | undefined;
  receivedTime: number;
  airdropState: AirdropProof | null;
}

export default function ClaimPage(props: {
  startLoading: Function;
  closeLoading: Function;
}) {
  const wallet = useWallet();
  const router = useRouter();
  const [foxes, setFoxes] = useState<FoxTypes[]>();
  const [tokenBalance, setTokenBalance] = useState(0);

  const getWalletNfts = async () => {
    console.log("updated!");
    if (wallet.publicKey === null) {
      setFoxes([]);
      return;
    }
    props.startLoading();
    let nfts: FoxTypes[] = [];
    let nftMints: string[] = [];
    const nftList = await getParsedNftAccountsByOwner({
      publicAddress: wallet.publicKey.toBase58(),
      connection: solConnection,
    });
    if (nftList.length !== 0) {
      for (let item of nftList) {
        if (item.data?.creators)
          if (
            item.data?.creators[0]?.address === CREATOR_ADDRESS ||
            item.data?.creators[1]?.address === CREATOR_ADDRESS_SECOND
          ) {
            nftMints.push(item.mint);
          }
      }
      if (nftMints.length !== 0) {
        const dateList = await Promise.all(
          nftMints.map((mint) =>
            getMintDate(mint, wallet.publicKey?.toBase58())
          )
        );
        const airdropStateList = await Promise.all(
          nftMints.map((mint) => getAirdropState(new PublicKey(mint)))
        );

        const uriList = await Promise.all(
          nftMints.map((mint) => getNftMetaData(new PublicKey(mint)))
        );

        let metaList: { image: string; name: string; tier: string }[] =
          await Promise.all(
            uriList.map((uri) =>
              fetch(uri)
                .then((resp) => resp.json())
                .then((json) => {
                  const edition = json.name.split("#")[1];
                  const tierName = getTier(parseInt(edition));
                  return {
                    image: json.image as string,
                    name: json.name as string,
                    tier: tierName as string,
                  };
                })
                .catch((error) => {
                  console.log(error);
                  return {
                    image: "",
                    name: "",
                    tier: "",
                  };
                })
            )
          );

        for (let i = 0; i < nftMints.length; i++) {
          nfts.push({
            mint: nftMints[i],
            image: metaList[i].image,
            name: metaList[i].name,
            tier: metaList[i].tier,
            mintDate: dateList[i].mintDate,
            receivedTime: dateList[i].receivedDate,
            airdropState: airdropStateList[i],
          });
        }
      }
      // console.log(nfts, "===> nfts");
      localStorage.setItem("fox-nfts", nfts.length.toString());
      setFoxes(nfts);
    } else {
      setFoxes([]);
    }
    const balance = await getTokenBalance(wallet.publicKey.toBase58());
    setTokenBalance(balance);
    props.closeLoading();
  };

  const getAllData = async () => {
    await getWalletNfts();
    if (wallet.publicKey !== null) {
      solConnection.onAccountChange(
        wallet.publicKey,
        async () => await getWalletNfts()
      );
      solConnection.onLogs(wallet.publicKey, async () => await getWalletNfts());
    }
  };

  const reloadPage = () => {
    router.reload();
  };

  const handeAirdropAll = async () => {
    let nfts: {
      mint: PublicKey;
      style: number;
      mintTime: number;
    }[] = [];
    if (foxes)
      for (let item of foxes) {
        if (item.airdropState === null) {
          let style = 0;
          switch (item.tier.toLowerCase()) {
            case "og":
              style = 1;
              break;
            case "private":
              style = 2;
              break;
            case "special":
              style = 3;
              break;
          }
          if (item.mintDate)
            nfts.push({
              mint: new PublicKey(item.mint),
              style: style,
              mintTime: item.mintDate / 1000,
            });
        }
      }
    try {
      await airdrop(
        wallet,
        nfts,
        () => props.startLoading(),
        () => props.closeLoading(),
        () => getAllData()
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handeCalimropAll = async () => {
    let nfts: {
      mint: PublicKey;
      style: number;
      receiveTime: number;
    }[] = [];
    if (foxes)
      for (let item of foxes) {
        if (item.airdropState === null) {
          let style = 0;
          switch (item.tier.toLowerCase()) {
            case "og":
              style = 1;
              break;
            case "private":
              style = 2;
              break;
            case "special":
              style = 3;
              break;
          }
          if (item.receivedTime)
            nfts.push({
              mint: new PublicKey(item.mint),
              style: style,
              receiveTime: item.receivedTime / 1000,
            });
        }
      }
    try {
      await claim(
        wallet,
        nfts,
        () => props.startLoading(),
        () => props.closeLoading(),
        () => getAllData()
      );
    } catch (error) {
      console.log(error);
    }
  };

  const refetchWallet = async () => {
    if (wallet.publicKey === null) return;
    const nftList = await getParsedNftAccountsByOwner({
      publicAddress: wallet.publicKey.toBase58(),
      connection: solConnection,
    });
    let nftMints: string[] = [];

    if (nftList.length !== 0) {
      for (let item of nftList) {
        if (item.data?.creators)
          if (
            item.data?.creators[0]?.address === CREATOR_ADDRESS ||
            item.data?.creators[1]?.address === CREATOR_ADDRESS_SECOND
          ) {
            nftMints.push(item.mint);
          }
      }
    }
    const pastNfts = localStorage.getItem("fox-nfts");
    if (pastNfts === null) {
      localStorage.setItem("fox-nfts", "0");
    } else {
      console.log(pastNfts);
      if (nftMints.length !== parseInt(pastNfts)) {
        infoAlert("Updating page...");
        getAllData();
      }
    }
  };
  const [now, setNow] = useState(new Date().getTime());
  const getNow = async () => {
    const n = await getNetworkTime();
    setNow(n * 1000);
  };
  useEffect(() => {
    getAllData();
    getNow();
    // setInterval(refetchWallet, 1000);
    //   eslint-disable-next-line
  }, [wallet.connected, wallet.publicKey]);

  return (
    <div className="main-page">
      <div className="container">
        <div className="top-info">
          <div className="item">
            <button
              className="btn-all"
              disabled={
                // !(
                //   foxes?.length &&
                //   foxes.filter((item) => item.airdropState !== null).length > 0
                // )
                true
              }
              onClick={() => handeCalimropAll()}
            >
              Claim all $MAJ
            </button>
          </div>
          <div className="item">
            <button
              className="btn-all"
              disabled={
                !(
                  foxes?.length &&
                  foxes.filter((item) => item.airdropState === null).length > 0
                )
              }
              onClick={() => handeAirdropAll()}
            >
              Claim all Airdrops
            </button>
          </div>
          <div className="item">
            <h1>
              Total Foxes: <span>{foxes && foxes.length}</span>
            </h1>
          </div>
          <div className="item">
            <h1>
              $MAJ Balance: <span>{tokenBalance.toLocaleString()}</span>
            </h1>
          </div>
        </div>
        <div className="nft-list">
          {foxes &&
            foxes.length !== 0 &&
            foxes.map((item, key) => (
              <NFTCard
                wallet={wallet}
                mint={item.mint}
                image={item.image}
                name={item.name}
                tier={item.tier}
                mintDate={item.mintDate ? item.mintDate : now}
                receivedDate={item.receivedTime ? item.receivedTime : now}
                airdropState={item.airdropState}
                key={key}
                startLoading={() => props.startLoading()}
                closeLoading={() => props.closeLoading()}
                getAllData={() => getAllData()}
              />
            ))}
        </div>
      </div>
    </div>
  );
}
