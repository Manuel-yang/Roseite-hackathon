import { PublicKey } from '@metaplex-foundation/js';
import {
    Menu,
    MenuItem,
    MenuButton,
    MenuHeader,
    MenuDivider
  } from '@szhsin/react-menu';
  import '@szhsin/react-menu/dist/index.css';
import useTweets from '../hooks/useTweets';
import { BN } from '@project-serum/anchor';
import { notifyLoading, notifyUpdate } from '../utils';
import JSConfetti from 'js-confetti';
import useTheme from '../hooks/useTheme';
import { Button, Dropdown } from "flowbite-react";
import { HiDotsVertical } from 'react-icons/hi';
  
  export default function UserTweetMenubar({nftMintAddress, postPdaAddress, postId} : {nftMintAddress: PublicKey, postPdaAddress: PublicKey, postId: BN}) {
    const jsConfetti = new JSConfetti();
    const { deleteTweet } = useTweets()
    const { theme } = useTheme();
    
    const deletePost = async () => {
      const toastId = notifyLoading("Transaction in progress. Please wait...", theme);
      const result = await deleteTweet(nftMintAddress, postPdaAddress, postId)
      notifyUpdate(toastId, result.message, result.success ? "success" : "error");
      if(result.success) {
        jsConfetti.addConfetti({
          emojiSize: 20,
          confettiNumber: 120,
        });
      }
    }
    return (
      <Dropdown 
        label=""  
        renderTrigger={() => 
        <Button size="xs" color='#191c29'>
          <HiDotsVertical color='#14F195'/>
        </Button>}>
        <Dropdown.Item onClick={deletePost}>Delete</Dropdown.Item>

      </Dropdown>
    );
  }
  