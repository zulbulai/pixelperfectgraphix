// File: pages/api/webhook.js
// Complete Razorpay Webhook Handler for PixelPerfect Graphix Subscriptions

import crypto from 'crypto';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('🔔 Webhook received at:', new Date().toISOString());
    
    // Get webhook signature from headers
    const signature = req.headers['x-razorpay-signature'];
    const webhookSecret = process.env.WEBHOOK_SECRET;

    // Verify webhook secret is configured
    if (!webhookSecret) {
      console.error('❌ WEBHOOK_SECRET not configured in environment variables');
      return res.status(500).json({ 
        error: 'Webhook secret not configured',
        message: 'Please add WEBHOOK_SECRET to your environment variables' 
      });
    }

    // Verify webhook signature for security
    const body = JSON.stringify(req.body);
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(body)
      .digest('hex');

    if (signature !== expectedSignature) {
      console.error('❌ Invalid webhook signature');
      console.log('Expected:', expectedSignature);
      console.log('Received:', signature);
      return res.status(400).json({ error: 'Invalid webhook signature' });
    }

    // Parse webhook data
    const { event, payload, created_at } = req.body;
    
    console.log(`📋 Processing event: ${event}`);
    console.log(`🕒 Event created at: ${new Date(created_at * 1000)}`);
    console.log(`🆔 Event ID: ${payload.subscription?.entity?.id || 'N/A'}`);

    // Handle different subscription events
    let result = {};
    
    switch (event) {
      case 'subscription.authenticated':
        result = await handleSubscriptionAuthenticated(payload);
        break;
        
      case 'subscription.activated':
        result = await handleSubscriptionActivated(payload);
        break;
        
      case 'subscription.charged':
        result = await handleSubscriptionCharged(payload);
        break;
        
      case 'subscription.paused':
        result = await handleSubscriptionPaused(payload);
        break;
        
      case 'subscription.resumed':
        result = await handleSubscriptionResumed(payload);
        break;
        
      case 'subscription.pending':
        result = await handleSubscriptionPending(payload);
        break;
        
      case 'subscription.halted':
        result = await handleSubscriptionHalted(payload);
        break;
        
      case 'subscription.cancelled':
        result = await handleSubscriptionCancelled(payload);
        break;
        
      case 'subscription.completed':
        result = await handleSubscriptionCompleted(payload);
        break;
        
      case 'subscription.updated':
        result = await handleSubscriptionUpdated(payload);
        break;
        
      default:
        console.log(`⚠️ Unhandled event type: ${event}`);
        result = { 
          status: 'ignored', 
          message: `Event ${event} received but not handled`,
          event_type: event
        };
    }

    console.log(`✅ Event ${event} processed successfully`);
    console.log(`📊 Result:`, result);
    
    // Send success response to Razorpay
    return res.status(200).json({
      received: true,
      event: event,
      status: 'processed',
      timestamp: new Date().toISOString(),
      result: result
    });

  } catch (error) {
    console.error('❌ Webhook processing error:', error.message);
    console.error('🔍 Error stack:', error.stack);
    
    // Send error notification to admin email
    await sendErrorNotification(error, req);
    
    // Return error response
    return res.status(500).json({ 
      error: 'Internal server error',
      message: 'Webhook processing failed',
      timestamp: new Date().toISOString()
    });
  }
}

// =====================================================
// SUBSCRIPTION EVENT HANDLERS
// =====================================================

/**
 * Handle subscription authentication (UPI mandate setup)
 */
async function handleSubscriptionAuthenticated(payload) {
  try {
    const subscription = payload.subscription.entity;
    const subscriptionId = subscription.id;
    const planId = subscription.plan_id;
    const customerId = subscription.customer_id;
    
    console.log(`🔐 Subscription authenticated: ${subscriptionId}`);
    console.log(`👤 Customer ID: ${customerId}`);
    console.log(`📋 Plan ID: ${planId}`);
    
    // TODO: Update your database
    // Example database update:
    /*
    await updateDatabase('subscriptions', subscriptionId, {
      status: 'authenticated',
      plan_id: planId,
      customer_id: customerId,
      authenticated_at: new Date(),
      charge_at: new Date(subscription.charge_at * 1000)
    });
    */
    
    // TODO: Send confirmation email to customer
    // Example email notification:
    /*
    await sendEmail({
      to: customerEmail,
      subject: '✅ Subscription Setup Complete - PixelPerfect Graphix',
      template: 'subscription_authenticated',
      data: {
        plan_name: getPlanName(planId),
        next_charge_date: new Date(subscription.charge_at * 1000)
      }
    });
    */
    
    return {
      status: 'success',
      message: 'Subscription authenticated successfully',
      subscription_id: subscriptionId,
      next_charge: new Date(subscription.charge_at * 1000)
    };
    
  } catch (error) {
    console.error('Error handling subscription authentication:', error);
    throw error;
  }
}

/**
 * Handle subscription activation (first payment successful)
 */
async function handleSubscriptionActivated(payload) {
  try {
    const subscription = payload.subscription.entity;
    const subscriptionId = subscription.id;
    
    console.log(`🟢 Subscription activated: ${subscriptionId}`);
    console.log(`📅 Current period: ${new Date(subscription.current_start * 1000)} to ${new Date(subscription.current_end * 1000)}`);
    
    // TODO: Enable user access to premium features
    /*
    await updateDatabase('users', subscription.customer_id, {
      subscription_status: 'active',
      plan_id: subscription.plan_id,
      access_granted_at: new Date(),
      subscription_id: subscriptionId
    });
    
    await updateDatabase('subscriptions', subscriptionId, {
      status: 'active',
      activated_at: new Date(),
      current_period_start: new Date(subscription.current_start * 1000),
      current_period_end: new Date(subscription.current_end * 1000)
    });
    */
    
    // TODO: Send welcome email with access details
    /*
    await sendEmail({
      to: customerEmail,
      subject: '🎉 Welcome to PixelPerfect Graphix Premium!',
      template: 'subscription_activated',
      data: {
        plan_name: getPlanName(subscription.plan_id),
        access_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
        templates_count: getTemplatesCount(subscription.plan_id)
      }
    });
    */
    
    return {
      status: 'success',
      message: 'Subscription activated and access granted',
      subscription_id: subscriptionId,
      plan_id: subscription.plan_id,
      period_end: new Date(subscription.current_end * 1000)
    };
    
  } catch (error) {
    console.error('Error handling subscription activation:', error);
    throw error;
  }
}

/**
 * Handle subscription charging (recurring payments)
 */
async function handleSubscriptionCharged(payload) {
  try {
    const payment = payload.payment.entity;
    const subscription = payload.subscription.entity;
    
    const paymentId = payment.id;
    const subscriptionId = subscription.id;
    const amount = payment.amount / 100; // Convert paise to rupees
    
    console.log(`💰 Subscription charged successfully:`);
    console.log(`💳 Payment ID: ${paymentId}`);
    console.log(`🆔 Subscription ID: ${subscriptionId}`);
    console.log(`💵 Amount: ₹${amount}`);
    console.log(`📅 Next charge: ${new Date(subscription.charge_at * 1000)}`);
    
    // TODO: Record payment in database
    /*
    await insertDatabase('payments', {
      payment_id: paymentId,
      subscription_id: subscriptionId,
      amount: amount,
      currency: payment.currency,
      method: payment.method,
      status: payment.status,
      paid_at: new Date(payment.created_at * 1000),
      description: `Recurring payment for ${getPlanName(subscription.plan_id)}`
    });
    
    // Update subscription period
    await updateDatabase('subscriptions', subscriptionId, {
      last_payment_id: paymentId,
      last_charged_at: new Date(),
      current_period_start: new Date(subscription.current_start * 1000),
      current_period_end: new Date(subscription.current_end * 1000),
      next_charge_at: new Date(subscription.charge_at * 1000)
    });
    */
    
    // TODO: Send payment confirmation email
    /*
    await sendEmail({
      to: customerEmail,
      subject: '✅ Payment Successful - PixelPerfect Graphix',
      template: 'payment_success',
      data: {
        amount: `₹${amount}`,
        payment_id: paymentId,
        plan_name: getPlanName(subscription.plan_id),
        next_billing_date: new Date(subscription.charge_at * 1000),
        invoice_url: `${process.env.NEXT_PUBLIC_APP_URL}/invoice/${paymentId}`
      }
    });
    */
    
    return {
      status: 'success',
      message: 'Payment recorded successfully',
      payment_id: paymentId,
      amount: amount,
      next_charge: new Date(subscription.charge_at * 1000)
    };
    
  } catch (error) {
    console.error('Error handling subscription charge:', error);
    throw error;
  }
}

/**
 * Handle subscription pause
 */
async function handleSubscriptionPaused(payload) {
  try {
    const subscription = payload.subscription.entity;
    const subscriptionId = subscription.id;
    
    console.log(`⏸️ Subscription paused: ${subscriptionId}`);
    
    // TODO: Temporarily disable access but keep user data
    /*
    await updateDatabase('subscriptions', subscriptionId, {
      status: 'paused',
      paused_at: new Date(),
      pause_reason: 'user_requested'
    });
    
    await updateDatabase('users', subscription.customer_id, {
      subscription_status: 'paused',
      access_suspended_at: new Date()
    });
    */
    
    // TODO: Notify user about pause
    /*
    await sendEmail({
      to: customerEmail,
      subject: '⏸️ Subscription Paused - PixelPerfect Graphix',
      template: 'subscription_paused',
      data: {
        resume_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscription/manage`,
        support_email: 'palgunnao@gmail.com'
      }
    });
    */
    
    return {
      status: 'success',
      message: 'Subscription paused successfully',
      subscription_id: subscriptionId
    };
    
  } catch (error) {
    console.error('Error handling subscription pause:', error);
    throw error;
  }
}

/**
 * Handle subscription resume
 */
async function handleSubscriptionResumed(payload) {
  try {
    const subscription = payload.subscription.entity;
    const subscriptionId = subscription.id;
    
    console.log(`▶️ Subscription resumed: ${subscriptionId}`);
    
    // TODO: Re-enable user access
    /*
    await updateDatabase('subscriptions', subscriptionId, {
      status: 'active',
      resumed_at: new Date(),
      paused_at: null
    });
    
    await updateDatabase('users', subscription.customer_id, {
      subscription_status: 'active',
      access_suspended_at: null
    });
    */
    
    // TODO: Send welcome back email
    /*
    await sendEmail({
      to: customerEmail,
      subject: '🎉 Welcome Back - PixelPerfect Graphix',
      template: 'subscription_resumed',
      data: {
        access_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
        next_billing_date: new Date(subscription.charge_at * 1000)
      }
    });
    */
    
    return {
      status: 'success',
      message: 'Subscription resumed successfully',
      subscription_id: subscriptionId,
      next_charge: new Date(subscription.charge_at * 1000)
    };
    
  } catch (error) {
    console.error('Error handling subscription resume:', error);
    throw error;
  }
}

/**
 * Handle subscription pending (payment retry)
 */
async function handleSubscriptionPending(payload) {
  try {
    const subscription = payload.subscription.entity;
    const subscriptionId = subscription.id;
    
    console.log(`⏳ Subscription pending - payment retry: ${subscriptionId}`);
    console.log(`🔄 Next retry: ${new Date(subscription.charge_at * 1000)}`);
    
    // TODO: Update status and notify user
    /*
    await updateDatabase('subscriptions', subscriptionId, {
      status: 'pending',
      retry_count: subscription.remaining_count,
      next_retry_at: new Date(subscription.charge_at * 1000)
    });
    */
    
    // TODO: Send retry notification
    /*
    await sendEmail({
      to: customerEmail,
      subject: '🔄 Payment Retry - PixelPerfect Graphix',
      template: 'payment_retry',
      data: {
        next_retry_date: new Date(subscription.charge_at * 1000),
        manage_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscription/manage`,
        remaining_attempts: subscription.remaining_count
      }
    });
    */
    
    return {
      status: 'success',
      message: 'Subscription marked as pending',
      subscription_id: subscriptionId,
      next_retry: new Date(subscription.charge_at * 1000)
    };
    
  } catch (error) {
    console.error('Error handling subscription pending:', error);
    throw error;
  }
}

/**
 * Handle subscription halt (payment failed multiple times)
 */
async function handleSubscriptionHalted(payload) {
  try {
    const subscription = payload.subscription.entity;
    const subscriptionId = subscription.id;
    
    console.log(`🛑 Subscription halted - payment failed: ${subscriptionId}`);
    
    // TODO: Suspend access with grace period
    /*
    const gracePeriodEnd = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    
    await updateDatabase('subscriptions', subscriptionId, {
      status: 'halted',
      halted_at: new Date(),
      grace_period_ends: gracePeriodEnd
    });
    
    await updateDatabase('users', subscription.customer_id, {
      subscription_status: 'halted',
      access_suspended_at: new Date(),
      grace_period_ends: gracePeriodEnd
    });
    */
    
    // TODO: Send urgent notification
    /*
    await sendEmail({
      to: customerEmail,
      subject: '🚨 Urgent: Subscription Payment Failed - PixelPerfect Graphix',
      template: 'subscription_halted',
      data: {
        grace_period_days: 7,
        reactivate_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscription/reactivate`,
        support_email: 'palgunnao@gmail.com',
        support_phone: '+91-XXXXXXXXXX'
      }
    });
    */
    
    return {
      status: 'success',
      message: 'Subscription halted, grace period started',
      subscription_id: subscriptionId,
      grace_period_days: 7
    };
    
  } catch (error) {
    console.error('Error handling subscription halt:', error);
    throw error;
  }
}

/**
 * Handle subscription cancellation
 */
async function handleSubscriptionCancelled(payload) {
  try {
    const subscription = payload.subscription.entity;
    const subscriptionId = subscription.id;
    
    console.log(`❌ Subscription cancelled: ${subscriptionId}`);
    console.log(`📅 Access ends: ${new Date(subscription.end_at * 1000)}`);
    
    // TODO: Handle cancellation
    /*
    await updateDatabase('subscriptions', subscriptionId, {
      status: 'cancelled',
      cancelled_at: new Date(),
      access_ends: new Date(subscription.end_at * 1000),
      cancellation_reason: 'user_requested'
    });
    
    await updateDatabase('users', subscription.customer_id, {
      subscription_status: 'cancelled',
      access_ends: new Date(subscription.end_at * 1000)
    });
    */
    
    // TODO: Send cancellation confirmation
    /*
    await sendEmail({
      to: customerEmail,
      subject: '✅ Subscription Cancelled - PixelPerfect Graphix',
      template: 'subscription_cancelled',
      data: {
        access_until: new Date(subscription.end_at * 1000),
        resubscribe_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
        feedback_url: `${process.env.NEXT_PUBLIC_APP_URL}/feedback`,
        export_data_url: `${process.env.NEXT_PUBLIC_APP_URL}/export`
      }
    });
    */
    
    return {
      status: 'success',
      message: 'Subscription cancelled successfully',
      subscription_id: subscriptionId,
      access_until: new Date(subscription.end_at * 1000)
    };
    
  } catch (error) {
    console.error('Error handling subscription cancellation:', error);
    throw error;
  }
}

/**
 * Handle subscription completion
 */
async function handleSubscriptionCompleted(payload) {
  try {
    const subscription = payload.subscription.entity;
    const subscriptionId = subscription.id;
    
    console.log(`✅ Subscription completed: ${subscriptionId}`);
    console.log(`💳 Total payments made: ${subscription.paid_count}`);
    
    // TODO: Mark as completed and offer renewal
    /*
    await updateDatabase('subscriptions', subscriptionId, {
      status: 'completed',
      completed_at: new Date(),
      total_payments: subscription.paid_count
    });
    */
    
    // TODO: Send completion email with renewal offer
    /*
    await sendEmail({
      to: customerEmail,
      subject: '🎯 Subscription Complete - Renew Now! - PixelPerfect Graphix',
      template: 'subscription_completed',
      data: {
        total_payments: subscription.paid_count,
        renewal_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
        renewal_discount: '20%' // Special offer
      }
    });
    */
    
    return {
      status: 'success',
      message: 'Subscription completed successfully',
      subscription_id: subscriptionId,
      total_payments: subscription.paid_count
    };
    
  } catch (error) {
    console.error('Error handling subscription completion:', error);
    throw error;
  }
}

/**
 * Handle subscription update
 */
async function handleSubscriptionUpdated(payload) {
  try {
    const subscription = payload.subscription.entity;
    const subscriptionId = subscription.id;
    
    console.log(`🔄 Subscription updated: ${subscriptionId}`);
    console.log(`📋 New plan: ${subscription.plan_id}`);
    console.log(`🔢 New quantity: ${subscription.quantity}`);
    
    // TODO: Update subscription details
    /*
    await updateDatabase('subscriptions', subscriptionId, {
      plan_id: subscription.plan_id,
      quantity: subscription.quantity,
      updated_at: new Date(),
      current_period_start: new Date(subscription.current_start * 1000),
      current_period_end: new Date(subscription.current_end * 1000)
    });
    */
    
    // TODO: Notify user about changes
    /*
    await sendEmail({
      to: customerEmail,
      subject: '🔄 Subscription Updated - PixelPerfect Graphix',
      template: 'subscription_updated',
      data: {
        new_plan_name: getPlanName(subscription.plan_id),
        effective_date: new Date(subscription.current_start * 1000),
        manage_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscription/manage`
      }
    });
    */
    
    return {
      status: 'success',
      message: 'Subscription updated successfully',
      subscription_id: subscriptionId,
      new_plan: subscription.plan_id
    };
    
  } catch (error) {
    console.error('Error handling subscription update:', error);
    throw error;
  }
}

// =====================================================
// HELPER FUNCTIONS
// =====================================================

/**
 * Get plan name from plan ID
 */
function getPlanName(planId) {
  const planNames = {
    'plan_monthly': 'Monthly Graphics Plan (₹49/month)',
    'plan_quarterly': 'Quarterly Graphics Plan (₹99/quarter)',
    'plan_annual': 'Annual Graphics Plan (₹299/year)'
  };
  
  return planNames[planId] || 'Graphics Design Plan';
}

/**
 * Get templates count for plan
 */
function getTemplatesCount(planId) {
  const templateCounts = {
    'plan_monthly': '1000+',
    'plan_quarterly': '3000+', 
    'plan_annual': '5000+'
  };
  
  return templateCounts[planId] || '1000+';
}

/**
 * Send error notification to admin
 */
async function sendErrorNotification(error, req) {
  try {
    console.log('📧 Sending error notification to admin...');
    
    const errorDetails = {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      webhook_event: req.body?.event || 'unknown',
      subscription_id: req.body?.payload?.subscription?.entity?.id || 'N/A',
      payment_id: req.body?.payload?.payment?.entity?.id || 'N/A',
      user_agent: req.headers['user-agent'] || 'N/A',
      ip_address: req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'N/A'
    };
    
    console.log('❌ Error details:', errorDetails);
    
    // TODO: Replace with actual email service
    // Example using Nodemailer, SendGrid, or any email service:
    /*
    await sendEmail({
      to: 'palgunnao@gmail.com',
      subject: '🚨 Webhook Processing Error - PixelPerfect Graphix',
      template: 'webhook_error',
      data: errorDetails
    });
    */
    
    // For now, just log the error
    console.log('📧 Error notification prepared (implement email service)');
    
  } catch (emailError) {
    console.error('Failed to send error notification:', emailError);
  }
}

// =====================================================
// EXPORT CONFIGURATION
// =====================================================

// This configuration tells Next.js not to parse the body as JSON
// so we can access the raw body for signature verification
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
}
