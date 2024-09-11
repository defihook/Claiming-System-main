import { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { FORTNIGHT_REWORD } from "../config";
import { claim } from "../contexts/transaction";
import { WalletContextState } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { ClipLoader } from "react-spinners";
import CloseIcon from "@mui/icons-material/Close";
import { getParsedNftAccountsByOwner } from "@nfteyez/sol-rayz";
import { solConnection } from "../contexts/utils";
import { errorAlert } from "./toastGroup";

export default function ClaimDialog(props: {
  wallet: WalletContextState;
  mint: string;
  name: string;
  image: string;
  mintDate: Date;
  tier: string;
  opened: boolean;
  onClose: Function;
  startLoading: Function;
  closeLoading: Function;
  getAllData: Function;
  fortnights: number;
  receviedTime: number;
  clearFortnight: Function;
}) {
  const {
    wallet,
    mint,
    tier,
    name,
    image,
    mintDate,
    opened,
    onClose,
    fortnights,
    receviedTime,
    clearFortnight,
  } = props;
  const theme = useTheme();
  const [fortnightReward, setFortnightReward] = useState(0);
  const [totalFortnightReward, setTotalFortnightReward] = useState(0);
  const [style, setStyle] = useState(0);
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [loading, setLoading] = useState(false);

  const updatePage = () => {
    props.getAllData();
    clearFortnight();
    onClose();
  };

  const handleClaim = async () => {
    if (wallet.publicKey === null) return;
    const nftList = await getParsedNftAccountsByOwner({
      publicAddress: wallet.publicKey.toBase58(),
      connection: solConnection,
    });
    if (nftList) {
      const isNft = nftList.find((nft) => nft.mint === mint);
      if (isNft) {
        try {
          await claim(
            wallet,
            [
              {
                mint: new PublicKey(mint),
                style: style,
                receiveTime: receviedTime / 1000,
              },
            ],
            () => setLoading(true),
            () => setLoading(false),
            () => updatePage()
          );
        } catch (error) {
          console.log(error);
        }
      } else {
        errorAlert("You don't have this NFT on your wallet. Updating page...");
        updatePage();
      }
    }
  };

  useEffect(() => {
    switch (tier.toLowerCase()) {
      case "og":
        setFortnightReward(FORTNIGHT_REWORD.og);
        setTotalFortnightReward(fortnights * FORTNIGHT_REWORD.og);
        setStyle(1);
        break;
      case "private":
        setFortnightReward(FORTNIGHT_REWORD.private);
        setTotalFortnightReward(fortnights * FORTNIGHT_REWORD.private);
        setStyle(2);
        break;
      case "special":
        setFortnightReward(FORTNIGHT_REWORD.special);
        setTotalFortnightReward(fortnights * FORTNIGHT_REWORD.special);
        setStyle(3);
        break;
    }
    //   eslint-disable-next-line
  }, [opened, tier]);

  return (
    <Dialog
      fullScreen={fullScreen}
      open={opened}
      maxWidth="sm"
      fullWidth
      //   onClose={() => onClose()}
    >
      <DialogTitle style={{ fontSize: 30, position: "relative" }}>
        <span>Claiming</span>
      </DialogTitle>
      <DialogContent>
        <button
          className="dialog-close"
          onClick={() => onClose()}
          disabled={loading}
        >
          <CloseIcon />
        </button>
        <div className="dialog-content">
          <div className="row">
            <div className="title">FOX : </div>
            <div className="dec">{name}</div>
          </div>
          <div className="row">
            <div className="title">Tier :</div>
            <div className="dec">{tier}</div>
          </div>
          <div className="row">
            <div className="title">Fortnight Reward :</div>
            <div className="dec">{fortnightReward}</div>
          </div>
          {/* <div className="row">
            <div className="title">Mint Date :</div>
            <div className="dec">{moment(mintDate).format()}</div>
          </div> */}
          <div className="row">
            <div className="title">Fortnights :</div>
            <div className="dec">{fortnights}</div>
          </div>
          <div className="row">
            <div className="title">Total Reward :</div>
            <div className="dec">~ {totalFortnightReward.toFixed(0)} $MAJ</div>
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <button
          className="btn-airdrop-modal"
          onClick={() => handleClaim()}
          disabled={loading}
        >
          {!loading ? (
            <span className="title">Claim $MAJ</span>
          ) : (
            <ClipLoader color="#fff" size={20} />
          )}
        </button>
      </DialogActions>
    </Dialog>
  );
}
