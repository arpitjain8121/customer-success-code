import React, { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";

import ContractsComp from "../../components/contracts";

import { fetchContracts, upadateContracts } from "../../redux/contracts/action";
import { arrayToObject } from "../../utils";

export default function Contracts({ mid, hideEdit }) {
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [buffer, setBuffer] = useState({});

  const contracts = useSelector(state => state.contracts.contracts);

  useEffect(() => {
    dispatch(fetchContracts({ mid })).finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mid]);

  const handleSetBuffer = data => {
    setBuffer({ ...buffer, [activeTab]: data });
  };

  const contractItemsMap = useMemo(
    () =>
      arrayToObject(
        contracts[activeTab]?.acquiringContractItems ?? [],
        "itemTypeId"
      ),
    [contracts, activeTab]
  );

  const paymentSettingItemsMap = useMemo(
    () =>
      arrayToObject(
        contracts[activeTab]?.paymentSettingItems ?? [],
        "itemTypeId"
      ),
    [contracts, activeTab]
  );

  const handleEdit = () => {
    const {
      businessId,
      contractId,
      productId,
      acquiringContractItems,
      paymentSettingItems,
      expiresOn,
      pricingPlanId
    } = contracts[activeTab];

    const newBuffer = {
      businessId,
      contractId,
      productId,
      expiryDate: new Date(expiresOn).toISOString().split("T")[0],
      pricingPlanTypeId: pricingPlanId,
      acquiringContractItems: [...(acquiringContractItems || [])],
      paymentSettingItems: [...(paymentSettingItems || [])]
    };

    setBuffer({ ...buffer, [activeTab]: newBuffer });
    setEditMode(true);
  };

  const handleEditCancel = () => {
    setBuffer({ [activeTab]: undefined });
    setEditMode(false);
  };

  const handleSave = async () => {
    try {
      let { paymentSettingItems, acquiringContractItems, ...rest } = buffer[
        activeTab
      ];

      const updateBuffer = { ...rest };

      paymentSettingItems = (
        buffer[activeTab].paymentSettingItems || []
      ).filter(
        ({ itemTypeId, itemValue }) =>
          paymentSettingItemsMap[itemTypeId].itemValue !== itemValue
      );

      acquiringContractItems = (
        buffer[activeTab].acquiringContractItems || []
      ).filter(
        ({ itemTypeId, pricePercentage, fixedPrice }) =>
          contractItemsMap[itemTypeId].pricePercentage !== pricePercentage ||
          contractItemsMap[itemTypeId].fixedPrice !== fixedPrice
      );

      if (paymentSettingItems.length) {
        updateBuffer.paymentSettingItems = paymentSettingItems;
      }

      if (acquiringContractItems.length) {
        updateBuffer.contractItems = acquiringContractItems;
      }

      await dispatch(upadateContracts(updateBuffer));

      setLoading(true);
      await dispatch(fetchContracts({ mid }));
      setLoading(false);
    } catch (err) {
      throw err;
    } finally {
      setEditMode(false);
      setBuffer({ [activeTab]: undefined });
    }
  };

  return (
    <ContractsComp
      activeTab={activeTab}
      contracts={contracts}
      loading={loading}
      editMode={editMode}
      buffer={buffer[activeTab]}
      setBuffer={handleSetBuffer}
      handleEdit={handleEdit}
      handleSave={handleSave}
      handleEditCancel={handleEditCancel}
      handleTabChange={setActiveTab}
      hideEdit={hideEdit}
    />
  );
}
