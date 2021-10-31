import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useIntl } from "react-intl";

import HomeComponent from "../../components/home";
import { getOnboardingActivities } from "../../redux/business/action";
import CONSTANTS from "../../constants";
const {
  ROUTES: {
    BUSINESS_PROFILE,
    BUSINESS_DOCUMENTS,
    ECOMMERCE_DOCUMENTS,
    PAYROLL_DOCUMENTS,
    POS_DOCUMENTS
  },
  PRODUCTS: { POS, ECOM, PAYROLL }
} = CONSTANTS;

const productRouteMapping = {
  [POS]: POS_DOCUMENTS,
  [ECOM]: ECOMMERCE_DOCUMENTS,
  [PAYROLL]: PAYROLL_DOCUMENTS
};

export default function Home() {
  const dispatch = useDispatch();
  const { formatMessage } = useIntl();

  const [loading, setLoading] = useState(true);
  const [onBoardingSteps, setOnBoardingSteps] = useState([]);

  const name = useSelector(state => state.business.name);
  const subtitle = useSelector(state => state.business.homeSubtitle);
  const profileCompletion = useSelector(
    state => state.business.profileCompletion
  );
  const documentsUploaded = useSelector(
    state => state.business.documentsUploaded
  );
  const productsCompletion = useSelector(
    state => state.business.productsCompletion
  );

  useEffect(() => {
    const fetchBusinessActivites = async () => {
      try {
        await dispatch(getOnboardingActivities());
      } catch (err) {
        throw err;
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessActivites();
  }, [dispatch]);

  useEffect(() => {
    setOnBoardingSteps([
      {
        name: formatMessage(
          { defaultMessage: "{action} Business Profile" },
          { action: profileCompletion >= 100 ? "Edit" : "Complete" }
        ),
        completion: profileCompletion,
        to: BUSINESS_PROFILE
      },
      {
        name: formatMessage({
          defaultMessage: "Upload Business Documents"
        }),
        completion: documentsUploaded,
        to: BUSINESS_DOCUMENTS
      }
    ]);
  }, [profileCompletion, documentsUploaded, productsCompletion]);

  return (
    <HomeComponent
      name={name}
      loading={loading}
      subtitle={subtitle}
      onboardingSteps={onBoardingSteps}
    />
  );
}
