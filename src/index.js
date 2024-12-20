import SingleplayerDomFunctions from "./scripts/dom";
import HumanPlayer from "./scripts/HumanPlayer";
import ComputerPlayer from "./scripts/ComputerPlayer";
import "./styles.css";

const player = HumanPlayer();
const enemy = ComputerPlayer();

const dom = SingleplayerDomFunctions(enemy, player);