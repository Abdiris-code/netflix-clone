import React, { useEffect, useState } from "react";
import "./PlansScreen.css";
import db from "../firebase";
import { selectUser } from "../features/userSlice";
import { useSelector } from "react-redux";
import { loadStripe } from "@stripe/stripe-js";

function PlansScreen() {
	const [products, setProducts] = useState([]);
	const user = useSelector(selectUser);
	const [subscription, setSubscription] = useState(null);

	useEffect(() => {
		db.collection("customers")
			.doc(user.uid)
			.collection("subscriptions")
			.get()
			.then((querySnapshot) => {
				querySnapshot.forEach(async (subscription) => {
					setSubscription({
						role: subscription.data().role,
						current_period_end: subscription.data().current_period_end.seconds,
						current_period_start: subscription.data().current_period_start
							.seconds,
					});
				});
			});
	}, [user.uid]);

	useEffect(() => {
		db.collection("products")
			.where("active", "==", true)
			.get()
			.then((querySnapshot) => {
				const products = {};
				querySnapshot.forEach(async (productsDoc) => {
					products[productsDoc.id] = productsDoc.data();
					const priceSnap = await productsDoc.ref.collection("prices").get();
					priceSnap.docs.forEach((price) => {
						products[productsDoc.id].prices = {
							priceId: price.id,
							priceData: price.data(),
						};
					});
				});
				setProducts(products);
			});
	}, []);
	//console.log(products);
	console.log(subscription);

	const loadChechOut = async (priceId) => {
		const docRef = await db
			.collection("customers")
			.doc(user.uid)
			.collection("checkout_sessions")
			.add({
				price: priceId,
				success_url: window.location.origin,
				cancel_url: window.location.origin,
			});

		docRef.onSnapshot(async (snap) => {
			const { error, sessionId } = snap.data();

			if (error) {
				// Show an error to your costumer and
				// inspect your cloud function log in the firebase console
				alert(`An error occurred ${error.message}`);
			}

			if (sessionId) {
				// We have a session, lets redirect to chechout
				// init
				const stripe = await loadStripe(
					"	pk_test_51ILPoJFhNq36fXR1whUlO8a8aWR0z9ATTEhA3l4Lb8ejtcdw1NKSeByhzrihRRWVU85flg6nLxE47rYwqzZChbLR00YHL1bFgc"
				);
				stripe.redirectToCheckout({ sessionId });
			}
		});
	};

	return (
		<div className="plansScreen">
			{subscription && <p>Renewal date:{new Date(subscription?.current_period_end * 1000).toLocaleDateString()} </p>}

			{Object.entries(products).map(([productId, productData]) => {
				//Todo:Add some logic to chech if the users subs is active...
				const isCurrentPackage = productData.name
					?.toLowerCase()
					.includes(subscription?.role);
				return (
					<div
						key={productId}
						className={`${
							isCurrentPackage && "plansScreen__plan--disabled"
						} plansScreen__plan `}
					>
						<div className="plansScreen__info">
							<h5>{productData.name} </h5>
							<h6>{productData.description}</h6>
						</div>
						<button
							onClick={() =>
								!isCurrentPackage && loadChechOut(productData.prices.priceId)
							}
						>
							{isCurrentPackage ? "Current Subsription" : "Subcribe"}
						</button>
					</div>
				);
			})}
		</div>
	);
}

export default PlansScreen;
