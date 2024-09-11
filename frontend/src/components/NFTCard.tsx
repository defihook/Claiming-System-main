import { useEffect, useState } from "react";
import { Skeleton } from "@mui/material";
import { WalletContextState } from "@solana/wallet-adapter-react";
import AirdropDialog from "./AirdropDialog";
import Progressbar from "./Progressbar";
import ClaimDialog from "./ClaimDialog";
import { AirdropProof } from "../contexts/type";
import { FORTNIGHT_LENGTH } from "../config";
import { useRouter } from "next/router";
import { getParsedNftAccountsByOwner } from "@nfteyez/sol-rayz";
import { getNetworkTime, solConnection } from "../contexts/utils";
import { errorAlert } from "./toastGroup";

export default function NFTCard(props: {
  mint: string;
  mintDate: number;
  receivedDate: number;
  airdropState: AirdropProof | null;
  wallet: WalletContextState;
  startLoading: Function;
  closeLoading: Function;
  getAllData: Function;
  image: string;
  name: string;
  tier: string;
}) {
  const {
    mint,
    mintDate,
    wallet,
    receivedDate,
    airdropState,
    image,
    name,
    tier,
  } = props;
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [isAirdrop, setIsAirdrop] = useState(false);
  const [fortNightStep, setFortNightStep] = useState(0);
  const [duration, setDuration] = useState(0);

  const [openAirDropModal, setOpenAirDropModal] = useState(false);
  const [openClaimodal, setOpenClaimodal] = useState(false);
  const [forceRender, serForceRender] = useState(false);

  const getNFTdetail = async () => {
    setLoading(true);
    setIsAirdrop(airdropState === null);
    const now = await getNetworkTime();

    if (airdropState) {
      const claimed = airdropState.claimedTime.toNumber() * 1000;
      let durations = 0;
      if (claimed > receivedDate) {
        durations = (now * 1000 - claimed) / (3600 * 1000);
      } else {
        durations = (now * 1000 - receivedDate) / (3600 * 1000);
      }
      setDuration(durations);
      setFortNightStep(Math.floor(durations / FORTNIGHT_LENGTH));
      serForceRender(!forceRender);
    }
    setLoading(false);
  };

  const onClaim = async () => {
    if (wallet.publicKey === null) return;
    const nftList = await getParsedNftAccountsByOwner({
      publicAddress: wallet.publicKey.toBase58(),
      connection: solConnection,
    });
    console.log(nftList);
    if (nftList) {
      const isNft = nftList.find((nft) => nft.mint === mint);
      if (isNft) {
        setOpenClaimodal(true);
      } else {
        errorAlert("You don't have this NFT on your wallet. Updating page...");
        updateCard();
      }
    }
  };

  const updateCard = async () => {
    await getNFTdetail();
    await props.getAllData();
  };

  useEffect(() => {
    getNFTdetail();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="nft-card">
      <div className="card-content">
        <p className="nft-name">{name}</p>
      </div>
      <div className="nft-card-content">
        <div className="tier">
          Tier: <span>{tier}</span>
        </div>
        {isAirdrop && (
          <button
            className="btn-airdrop"
            onClick={() => setOpenAirDropModal(true)}
          >
            {/* eslint-disable-next-line */}
            <img src="/icons/airdrop.png" alt="" />
            <span>Airdrop</span>
          </button>
        )}
        <div className="media">
          {loading ? (
            <Skeleton
              variant="rectangular"
              style={{
                width: 240,
                height: 240,
                background: "#ffffff20",
                margin: 5,
              }}
            />
          ) : (
            <>
              {/* eslint-disable-next-line */}
              <img src={image} alt="" />
            </>
          )}
        </div>
        {!isAirdrop && !loading && (
          <div className="claim-box">
            <div className="claim-box-line">
              <h4>
                Fortnights completed: <span>{fortNightStep}</span>
              </h4>
            </div>
            <div className="claim-box-line">
              <h4>Fortnight progress:</h4>
              <Progressbar days={duration % FORTNIGHT_LENGTH} />
            </div>
            <button
              className="btn-claim"
              disabled={fortNightStep === 0}
              onClick={() => onClaim()}
            >
              <span>Claim</span>
            </button>
          </div>
        )}
      </div>
      <AirdropDialog
        wallet={props.wallet}
        mint={props.mint}
        name={name}
        image={image}
        mintDate={new Date(mintDate)}
        opened={openAirDropModal}
        tier={tier}
        onClose={() => setOpenAirDropModal(false)}
        startLoading={() => props.startLoading()}
        closeLoading={() => props.closeLoading()}
        getAllData={() => updateCard()}
      />
      <ClaimDialog
        wallet={props.wallet}
        mint={props.mint}
        name={name}
        image={image}
        mintDate={new Date(mintDate)}
        opened={openClaimodal}
        tier={tier}
        receviedTime={receivedDate}
        onClose={() => setOpenClaimodal(false)}
        startLoading={() => props.startLoading()}
        closeLoading={() => props.closeLoading()}
        getAllData={() => updateCard()}
        fortnights={fortNightStep}
        clearFortnight={() => setFortNightStep(0)}
      />
    </div>
  );
}
