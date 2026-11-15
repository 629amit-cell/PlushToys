import { isOrderEmailConfigured, sendOrderConfirmationEmail } from "./email.js";
import {
  claimOrderConfirmationEmail,
  getOrderByRazorpayOrderId,
  markOrderConfirmationEmailSent,
  releaseOrderConfirmationEmailClaim,
} from "./orders.js";

export function queueOrderConfirmationEmail(env, razorpayOrderId, waitUntil) {
  if (!razorpayOrderId || !isOrderEmailConfigured(env)) return null;

  const task = (async () => {
    let claimed = false;

    try {
      claimed = await claimOrderConfirmationEmail(env, razorpayOrderId);
    } catch (error) {
      console.error("Could not claim the order confirmation email.", error);
      return;
    }
    if (!claimed) return;

    let orderNumber = razorpayOrderId;

    try {
      const order = await getOrderByRazorpayOrderId(env, razorpayOrderId);
      if (!order) throw new Error("The paid order could not be found.");
      orderNumber = order.order_number || razorpayOrderId;

      const { messageId } = await sendOrderConfirmationEmail(env, order);
      await markOrderConfirmationEmailSent(env, razorpayOrderId, messageId);
      console.log(`Order confirmation email sent for ${orderNumber}.`);
    } catch (error) {
      console.error(`Order confirmation email failed for ${orderNumber}.`, error);
      try {
        await releaseOrderConfirmationEmailClaim(
          env,
          razorpayOrderId,
          error instanceof Error ? error.message : String(error),
        );
      } catch (releaseError) {
        console.error("Could not release the confirmation email claim.", releaseError);
      }
    }
  })();

  if (typeof waitUntil === "function") {
    waitUntil(task);
  } else {
    task.catch((error) => {
      console.error("Unexpected order confirmation email failure.", error);
    });
  }

  return task;
}
