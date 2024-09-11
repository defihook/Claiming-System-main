import { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import moment from "moment";
import { FORTNIGHT_LENGTH, FORTNIGHT_REWORD } from "../config";
import { airdrop } from "../contexts/transaction";
import { WalletContextState } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { ClipLoader } from "react-spinners";
import CloseIcon from "@mui/icons-material/Close";

export default function AirdropDialog(props: {
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
}) {
  const { wallet, mint, tier, name, image, mintDate, opened, onClose } = props;
  const theme = useTheme();
  const [fortnightReward, setFortnightReward] = useState(0);
  const [style, setStyle] = useState(0);
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [totalAirdrop, setTotalAirdrop] = useState(0);
  const [loading, setLoading] = useState(false);

  const updatePage = () => {
    props.getAllData();
    onClose();
  };

  const handleAirdrop = async () => {
    try {
      await airdrop(
        wallet,
        [
          {
            mint: new PublicKey(mint),
            style: style,
            mintTime: new Date(mintDate).getTime() / 1000,
          },
        ],
        () => setLoading(true),
        () => setLoading(false),
        () => updatePage()
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fortnightStep = Math.floor(
      (new Date().getTime() - new Date(mintDate).getTime()) /
        (3600 * 1000 * FORTNIGHT_LENGTH)
    );
    switch (tier.toLowerCase()) {
      case "og":
        setFortnightReward(FORTNIGHT_REWORD.og);
        setTotalAirdrop(fortnightStep * FORTNIGHT_REWORD.og);
        setStyle(1);
        break;
      case "private":
        setFortnightReward(FORTNIGHT_REWORD.private);
        setTotalAirdrop(fortnightStep * FORTNIGHT_REWORD.private);
        setStyle(2);
        break;
      case "special":
        setFortnightReward(FORTNIGHT_REWORD.special);
        setTotalAirdrop(fortnightStep * FORTNIGHT_REWORD.special);
        setStyle(3);
        break;
    }
    //   eslint-disable-next-line
  }, [opened, tier]);

  return (
    <Dialog
      fullScreen={fullScreen}
      open={opened}
      //   onClose={() => onClose()}
    >
      <DialogTitle style={{ fontSize: 30, position: "relative" }}>
        <span>Airdrop</span>
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
            <div className="title">Mint Date :</div>
            <div className="dec">
              {moment(mintDate).fromNow()}
              <span>{`(${mintDate})`}</span>
            </div>
          </div>
          <div className="row">
            <div className="title">Fortnight Reward :</div>
            <div className="dec">{fortnightReward} $MAJ</div>
          </div>
          <div className="row">
            <div className="title">Total Airdrop :</div>
            <div className="dec">~ {totalAirdrop.toFixed(0)} $MAJ</div>
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <button
          className="btn-airdrop-modal"
          onClick={() => handleAirdrop()}
          disabled={loading}
        >
          {!loading ? (
            <span className="title">Claim Airdrop</span>
          ) : (
            <ClipLoader color="#fff" size={20} />
          )}
        </button>
      </DialogActions>
    </Dialog>
  );
}
