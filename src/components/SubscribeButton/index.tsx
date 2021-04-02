import { signIn, useSession } from "next-auth/client";
import { useRouter } from "next/dist/client/router";
import { api } from "../../services/api";
import { getStripeJs } from "../../services/stripe-js";
import styles from "./style.module.scss";

interface SubscribeButtonProps {
  productId: string;
}

export function SubscribeButton({ productId }: SubscribeButtonProps) {
  const [session] = useSession();
  const router = useRouter();

  async function handleSubscribe(){
    if(!session){
      signIn('github');
      return;
    }

    if(session.activeSubscription){
      router.push('/Posts');
      return;
    }

    try {
      const response = await api.post('/subscribe');
      const {sessionId} = response.data;

      const stripe = await getStripeJs();
      await stripe.redirectToCheckout({sessionId});

    } catch (error) {
      alert(error.message);
    }
  }


  return (
    <button type="button" className={styles.subscribeButton} onClick={handleSubscribe}>
      Subscribe Now
    </button>
  );
}
