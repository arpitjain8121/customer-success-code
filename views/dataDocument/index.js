import React, { useEffect, useState, createRef } from "react";
import { useSelector, useDispatch } from "react-redux";

import DataDocumentComp from "components/dataDocument";
import { fetchBusinessTypes } from "redux/util/action";
import {
  fetchApplication,
  uploadKycDocuments,
  updateKycDetails,
  updateKycStatus
} from "redux/applications/action";

const APPROVED = 3;
const REJECTED = 2;

export default function DataDocument({ mid, hideEdit }) {
  const dispatch = useDispatch();

  const [docs, setDocs] = useState([]);
  const [activeDoc, setActiveDoc] = useState();
  const [rejectVisible, setRejectVisible] = useState(false);
  const [editMode, setEditMode] = useState();
  const [uploadedDoc, setUploadedDoc] = useState();
  const [showUploadView, setShowUploadView] = useState(false);
  const [loading, setLoading] = useState(true);
  const [innerLoading, setInnerLoading] = useState(false);

  const application = useSelector(
    state => state.applications.activeApplication
  );

  const businessTypes = useSelector(state => state.utils.businessTypes);

  useEffect(() => {
    dispatch(fetchBusinessTypes());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchApplication({ id: mid })).then(() => setLoading(false));
  }, [dispatch, mid]);

  useEffect(() => {
    const pushRef = list => {
      if (list) {
        return list.map(item => {
          if (item.status !== 1) {
            return { ...item, docRef: createRef() };
          }
          return { ...item };
        });
      }
    };

    if (application) {
      const _docs = {};
      const { kyc, kyb } = application;

      if (kyb) {
        Object.assign(_docs, {
          kyb: {
            basicDocument: pushRef(kyb.basicDocument.documentItems),
            identityDocument: pushRef(kyb.identityDocument.documentItems),
            addressDocument: pushRef(kyb.addressDocument.documentItems)
          }
        });
      }
      if (kyc) {
        Object.assign(_docs, {
          kyc: {
            identityDocument: pushRef(kyc.identityDocument.documentItems),
            addressDocument: pushRef(kyc.addressDocument.documentItems),
            signatureProofDocument: pushRef(
              kyc.signatureProofDocument.documentItems
            )
          }
        });
      }

      setDocs(_docs);
    }
  }, [application]);

  const handleGoTo = docRef => {
    if (docRef.current) {
      docRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleNewMultiPageDocs = doc => {
    setActiveDoc(doc);
    setShowUploadView(true);
  };

  const handleNewDocument = (doc, { typeId, uploadSides, categoryId }) => {
    setInnerLoading(true);
    const createNewDocument = async () => {
      // const docRef = createRef();

      // setEditMode(false);

      await dispatch(
        uploadKycDocuments({
          businessId: mid,
          documentTypeId: typeId,
          uploadSideId: uploadSides,
          documentCategoryId: categoryId,
          file: doc
        })
      );

      await dispatch(fetchApplication({ id: mid }));
      setInnerLoading(false);
    };

    if (!activeDoc) {
      createNewDocument();
    } else {
      if (
        window.confirm(
          "The progress in the current doc will be lost when adding new doc. \n Do you still want to continue?"
        )
      ) {
        createNewDocument();
      }
    }
  };

  const handleEditActiveDoc = (index, value) => {
    // TODO: Add React's transactions here
    const _parameters = [...activeDoc.parameters];

    _parameters[index] = {
      ..._parameters[index],
      responseSignzyValue: value
    };

    setActiveDoc({
      ...activeDoc,
      parameters: _parameters
    });
  };

  const handleSubmitActiveDoc = async () => {
    const { typeId, categoryId, parameters } = activeDoc;
    setInnerLoading(true);
    await dispatch(
      updateKycDetails({
        businessId: mid,
        documentTypeId: typeId,
        documentCategoryId: categoryId,
        documentItems: parameters.map(({ name, responseSignzyValue }) => ({
          fieldName: name,
          fieldValue: responseSignzyValue
        }))
      })
    );
    await dispatch(fetchApplication({ id: mid }));
    setActiveDoc(undefined);
    setInnerLoading(false);
  };

  const handleRejectDoc = async (msg, { categoryId, documentId }) => {
    setInnerLoading(true);
    await dispatch(
      updateKycStatus({
        documentId,
        businessId: mid,
        documentCategoryId: categoryId,
        statusId: REJECTED,
        remarks: msg
      })
    );
    setRejectVisible(false);
    setActiveDoc(undefined);
    await dispatch(fetchApplication({ id: mid }));
    setInnerLoading(false);
  };

  const handleAcceptDoc = async ({ categoryId, documentId }) => {
    setInnerLoading(true);
    await dispatch(
      updateKycStatus({
        documentId,
        businessId: mid,
        documentCategoryId: categoryId,
        statusId: APPROVED
      })
    );
    await dispatch(fetchApplication({ id: mid }));
    setInnerLoading(false);
  };

  const openRejectModal = doc => {
    setActiveDoc(doc);
    setRejectVisible(true);
  };

  const enableEdit = doc => {
    setActiveDoc(doc);
    setEditMode(true);
  };

  const disableEdit = () => {
    setEditMode(false);
    setActiveDoc(undefined);
    setUploadedDoc(undefined);
  };

  const handleUpload = doc => {
    handleNewDocument(doc, activeDoc);
    setShowUploadView(false);
    setActiveDoc(undefined);
  };

  const closeUploadView = () => {
    if (activeDoc.isInitial) {
      setActiveDoc(undefined);
    }
    setShowUploadView(false);
  };

  const openUploadView = () => {
    setShowUploadView(true);
  };

  return (
    <DataDocumentComp
      loading={loading}
      hideEdit={hideEdit}
      isDisabled={false}
      docs={docs}
      activeDoc={activeDoc}
      handleSubmitActiveDoc={handleSubmitActiveDoc}
      handleEditActiveDoc={handleEditActiveDoc}
      businessTypes={businessTypes}
      handleGoTo={handleGoTo}
      handleNewDocument={handleNewDocument}
      rejectVisible={rejectVisible}
      openRejectModal={openRejectModal}
      closeRejectModal={() => {
        setRejectVisible(false);
        setActiveDoc(undefined);
      }}
      handleRejectDoc={handleRejectDoc}
      handleAcceptDoc={handleAcceptDoc}
      editMode={editMode}
      enableEdit={enableEdit}
      disableEdit={disableEdit}
      setUploadedDoc={setUploadedDoc}
      showUploadView={showUploadView}
      openUploadView={openUploadView}
      closeUploadView={closeUploadView}
      handleUpload={handleUpload}
      handleNewMultiPageDocs={handleNewMultiPageDocs}
      innerLoading={innerLoading}
    />
  );
}
