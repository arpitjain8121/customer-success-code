import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  createContext
} from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { FormattedMessage, useIntl } from "react-intl";
import equal from "fast-deep-equal";

import AddEmpComp from "../../components/addEmployee";
import Kyc from "../../components/addEmployee/kyc";
import BankDetails from "../../components/addEmployee/bankDetails";
import SalaryDetails from "../../components/addEmployee/salaryDetails";
import EmployeeDetails from "../../components/addEmployee/employeeDetails";

import empDetailsSchema from "./empDetailSchema";
import kycSchema from "./kycSchema";
import salarySchema from "./salarySchema";
import bankSchema from "./bankSchema";

import {
  getEmployee,
  createEmployee,
  updateEmployee,
  updateAccount,
  updateKyc,
  updateSalary,
  resetActiveEmployee,
  deactivateEmployee,
  activateEmployee
} from "../../redux/employees/action";
import { getDepartments } from "../../redux/departments/action";
import { getCountries } from "../../redux/util/action";

import CONSTANTS from "../../constants";
import { getDateFormat, parseDateFormat, pluck } from "../../utils";
import { useFormValidation } from "../../hooks/useFormValidation";
import useMessage from "../../hooks/useMessage";

const {
  ROUTES: { EMPLOYEE, DEPARTMENTS },
  KYC_STATUSES
} = CONSTANTS;

const EMPLOYEE_INACTIVE = 4;

export const PermissionContext = createContext({});

function useTabProps(schema) {
  const {
    state,
    disable,
    clear,
    handleBlur,
    handleChange,
    updateState
  } = useFormValidation({ ...schema });

  const hasChanged = data => {
    return !equal(pluck(data, ["value"]), pluck(state, ["value"]));
  };

  const formProps = (field = {}) => ({
    type: "text",
    name: field.name,
    value: field.value,
    error: field.error,
    nonEditable: field.nonEditable,
    className: "form-item",
    onBlur: handleBlur,
    onChange: handleChange
  });

  return [state, disable, formProps, clear, hasChanged, updateState];
}

export default function AddEmployee({ modulePermission, match }) {
  const history = useHistory();
  const dispatch = useDispatch();
  const { formatMessage } = useIntl();

  const message = useMessage();

  const [
    empState,
    empDisabled,
    empFormProps,
    empClear,
    empHasChanged,
    updateEmpState
  ] = useTabProps(empDetailsSchema());

  const [
    kycState,
    kycDisabled,
    kycFormProps,
    kycClear,
    kycHasChanged
  ] = useTabProps(kycSchema());

  const [
    salaryState,
    salaryDisabled,
    salaryFormProps,
    salaryClear,
    salaryHasChanged,
    updateSalaryState
  ] = useTabProps(salarySchema());

  const [
    bankState,
    bankDisabled,
    bankFormProps,
    bankClear,
    bankHasChanged
  ] = useTabProps(bankSchema());

  const empRef = useRef(empState);
  const kycRef = useRef(kycState);
  const salaryRef = useRef(salaryState);
  const bankRef = useRef(bankState);

  const [activeTab, setActiveTab] = useState(0);
  const [activeKycTab, setActiveKycTab] = useState(0);
  const [empProfilePic, setEmpProfilePic] = useState();

  const [oldKyc, setOldKyc] = useState();
  const [account, setAccount] = useState();

  const [passportPic, setPassportPic] = useState([]);
  const [idPic, setIdPic] = useState([]);
  const [loader, setLoader] = useState(false);
  const [pageLoader, setPageLoader] = useState(false);
  const [pageTitle, setPageTitle] = useState(
    formatMessage({ defaultMessage: "Add Employee" })
  );
  const [uneditable, setUneditable] = useState(false);
  const [deactivateModalVisible, setDeactivateModalVisible] = useState(false);
  const [deactivationLoader, setDeactivationLoader] = useState(false);
  const [ibanModalVisible, setIbanModalVisible] = useState(false);
  const [payslipModalVisible, setPayslipModalVisible] = useState(false);
  const [deactivationStatus, setDeactivationStatus] = useState();

  const disabled = {
    0: empDisabled,
    1:
      (kycDisabled || passportPic.length === 0 || idPic.length === 0) &&
      !(oldKyc && Object.keys(oldKyc).length > 0),
    2: salaryDisabled,
    3: bankDisabled
  }[activeTab];

  const allDepartments = useSelector(state => state.departments.departments);
  const countries = useSelector(state => state.utils.countries);
  const euid = useSelector(state => state.employees.activeEmpUid);
  const activeEmp = useSelector(state => state.employees.activeEmp);

  useEffect(() => {
    fetchEmployee(match.params.id);
  }, [match]);

  function fetchEmployee(euid) {
    if (euid) {
      setPageLoader(true);
      dispatch(getEmployee(euid)).finally(() => {
        setPageLoader(false);
      });
    }
  }

  useEffect(() => {
    dispatch(getDepartments());
    dispatch(getCountries());

    return () => {
      dispatch(resetActiveEmployee());
    };
  }, [dispatch]);

  useEffect(() => {
    if (activeEmp) {
      const {
        profilePicPath = "",
        employeeNumber,
        departmentId,
        jobTitle = "",
        firstName,
        middleName = "",
        lastName,
        gender,
        dateOfBirth,
        placeOfBirth,
        phoneNumber,
        email = "",
        addressLine1,
        addressLine2 = "",
        city,
        deactivationInProgress,
        statusId,
        accountInfo = [],
        kycInfo = [],
        salaryInfo: {
          basicSalary,
          foodAllowance,
          accommodation,
          standardRate,
          overTimeRate,
          holidayRate
        }
      } = activeEmp;

      let uneditable = !!kycInfo.length;

      const _kycInfo = {};

      kycInfo.forEach(
        ({ documentTypeId, additionalData, documentStatusId, ...rest }) => {
          uneditable = uneditable && documentStatusId === KYC_STATUSES.APPROVED;

          const documentType = {
            30: "passport",
            5: "id",
            35: "id"
          }[documentTypeId];

          if (!(documentType in _kycInfo) || documentTypeId === 5) {
            _kycInfo[documentType] = {
              documentTypeId,
              documentStatusId,
              nationality: additionalData[0],
              documentName: additionalData[1],
              ...rest
            };
          }
        }
      );

      setUneditable(uneditable);
      setOldKyc(_kycInfo);
      setPageTitle(
        formatMessage(
          {
            defaultMessage: "{employeeNumber} - {name}"
          },
          { employeeNumber, name: `${firstName} ${middleName} ${lastName}` }
        )
      );
      setAccount(accountInfo);

      updateEmpState({
        employeeNumber,
        departmentId,
        jobTitle,
        firstName,
        middleName,
        lastName,
        gender,
        dateOfBirth: parseDateFormat(dateOfBirth),
        placeOfBirth,
        phoneNumber,
        email,
        addressLine1,
        addressLine2,
        city
      });

      updateSalaryState({
        basicSalary,
        foodAllowance,
        accommodation,
        standardRate,
        overTimeRate,
        holidayRate
      });

      setEmpProfilePic(profilePicPath);
      setDeactivationStatus(
        statusId === EMPLOYEE_INACTIVE
          ? "inactive"
          : deactivationInProgress
          ? "in-progress"
          : "active"
      );
    }
  }, [activeEmp]);

  const handleActivationDeactivation = () => {
    if (deactivationStatus === "active") {
      setDeactivateModalVisible(true);
    } else if (deactivationStatus === "inactive") {
      dispatch(activateEmployee(euid, 1))
        .then(() => {
          const isExpired =
            oldKyc?.password?.documentStatusId === KYC_STATUSES.EXPIRED ||
            oldKyc?.id?.documentStatusId === KYC_STATUSES.EXPIRED;

          const isInGrace =
            oldKyc?.password?.documentStatusId === KYC_STATUSES.IN_GRACE ||
            oldKyc?.id?.documentStatusId === KYC_STATUSES.IN_GRACE;

          message.success(
            formatMessage(
              {
                defaultMessage:
                  "The employee {euid} - {name} is activated successfully. <b>{msg}</b>"
              },
              {
                euid,
                name: pageTitle.split(" - ")[1],
                msg: isInGrace
                  ? formatMessage({
                      defaultMessage: "KYC is going to expire soon."
                    })
                  : undefined,
                b: chunks => <span style={{ fontWeight: 600 }}>{chunks}</span>
              }
            ),
            true,
            {
              title: formatMessage({
                defaultMessage: "Employee Activated Successfully!"
              }),
              ...(isInGrace || isExpired
                ? {
                    okText: formatMessage({
                      defaultMessage: "Update KYC Documents"
                    }),
                    onOkClick: () => {
                      setActiveTab(1);
                    }
                  }
                : {})
            }
          );
        })
        .catch(err => {
          message.error(
            formatMessage(
              {
                defaultMessage:
                  "Activation of {name} failed due to {reason}. Please try again after some time."
              },
              { name: pageTitle.split(" - ")[1], reason: err?.data?.message }
            ),
            true,
            { title: formatMessage({ defaultMessage: "Activation Failed!" }) }
          );
        });
    }
  };

  const closeDeactivationModal = () => {
    setDeactivateModalVisible(false);
  };

  const handleCancel = () => {
    if (
      window.confirm(
        formatMessage({ defaultMessage: "Do you really want to clear?" })
      )
    ) {
      ({
        0: empClear,
        1: kycClear,
        2: salaryClear,
        3: bankClear
      }[activeTab]());

      setEmpProfilePic(undefined);
      setPassportPic(undefined);
      setIdPic(undefined);
    }
  };

  const handleEmpDetailsNext = async step => {
    const data = {
      empProfilePic,
      isdCode: "+974",
      countryId: 186
    };

    for (const field in empState) {
      data[field] = empState[field].value;
    }

    data.dateOfBirth = getDateFormat(data.dateOfBirth);

    try {
      setLoader(true);

      if (!euid) {
        await dispatch(createEmployee({ ...data }));
      } else if (
        empHasChanged(empRef.current) ||
        (empProfilePic && typeof empProfilePic !== "string")
      ) {
        await dispatch(updateEmployee(euid, { ...data }));
      }

      setActiveTab(step);
      empRef.current = empState;
    } catch (err) {
      throw err;
    } finally {
      setLoader(false);
    }
  };

  const handleKycNext = step => {
    const data = {};

    for (const field in kycState) {
      data[field] = kycState[field].value;
    }

    if (kycHasChanged(kycRef.current)) {
      setLoader(true);

      Promise.all([
        ...(data.passportExpiry && data.passportNumber
          ? [
              dispatch(
                updateKyc(euid, {
                  uid: euid,
                  nationalityId: Number(data.nationality?.value?.id),
                  documentTypeId: 30, //passport
                  documentExpiry: getDateFormat(data.passportExpiry),
                  documentNumber: Number(data.passportNumber),
                  documentPic: passportPic
                })
              )
            ]
          : []),
        ...(data.documentExpiry && data.documentNumber
          ? [
              dispatch(
                updateKyc(euid, {
                  uid: euid,
                  documentTypeId: Number(data.documentTypeId),
                  documentExpiry: getDateFormat(data.documentExpiry),
                  documentNumber: Number(data.documentNumber),
                  documentPic: idPic
                })
              )
            ]
          : [])
      ])
        .then(() => {
          setActiveTab(step);
          fetchEmployee(euid);
        })
        .catch(err => {
          throw err;
        })
        .finally(() => {
          setLoader(false);
        });
    } else {
      setActiveTab(step);
      kycRef.current = kycState;
    }
  };

  const handleSalaryNext = async step => {
    const data = {};

    for (const field in salaryState) {
      data[field] = Number(salaryState[field].value);
    }

    try {
      setLoader(true);

      if (salaryHasChanged(salaryRef.current)) {
        await dispatch(updateSalary(euid, data));
      }

      setActiveTab(step);
      salaryRef.current = salaryState;
    } catch (err) {
      throw err;
    } finally {
      setLoader(false);
    }
  };

  const handleBankNext = async step => {
    try {
      setLoader(true);

      if (bankHasChanged(bankRef.current)) {
        await dispatch(
          updateAccount(euid, {
            iban: bankState.iban.value,
            selectedForPayroll: true
          })
        );

        fetchEmployee(euid);
      }

      bankRef.current = bankState;

      if (step) {
        setActiveTab(step);
      }
    } catch (err) {
      throw err;
    } finally {
      setLoader(false);
    }
  };

  const deactivateEmp = data => {
    setDeactivationLoader(true);

    dispatch(deactivateEmployee(euid, data))
      .then(() => {
        fetchEmployee(euid);
        message.success(
          formatMessage(
            {
              defaultMessage:
                "Reqeust to deactivate employee {name} is submitted to QPAY Successfully."
            },
            { name: pageTitle.split(" - ")[1] }
          )
        );
      })
      .catch(err => {
        message.error(
          formatMessage(
            {
              defaultMessage:
                "Request to deactivate employee {name} failed because <b>{reason}</b> Try again after sometime."
            },
            {
              name: pageTitle.split(" - ")[1],
              reason: err?.data?.message,
              b: chunks => <span style={{ fontWeight: 600 }}>{chunks}</span>
            }
          )
        );
      })
      .finally(() => {
        setDeactivationLoader(false);
        setDeactivateModalVisible(false);
      });
  };

  const handleAddIbanClose = () => {
    setIbanModalVisible(false);
    bankClear();
  };

  const handleCreateDepartment = useCallback(() => {
    history.push(DEPARTMENTS);
  }, [history]);

  const handleBack = () => {
    history.goBack();
  };

  const panes = [
    {
      title: <FormattedMessage defaultMessage="Employee Details" />,
      content: (
        <EmployeeDetails
          state={empState}
          uneditable={uneditable}
          formProps={empFormProps}
          empProfilePic={empProfilePic}
          allDepartments={allDepartments}
          isDeactivated={deactivationStatus === "inactive"}
          setEmpProfilePic={setEmpProfilePic}
          handleCreateDepartment={handleCreateDepartment}
        />
      )
    },
    {
      title: <FormattedMessage defaultMessage="KYC" />,
      content: (
        <Kyc
          idPic={idPic}
          state={kycState}
          oldKyc={oldKyc}
          setIdPic={setIdPic}
          formProps={kycFormProps}
          passportPic={passportPic}
          setPassportPic={setPassportPic}
          activeTab={activeKycTab}
          countries={countries}
          isDeactivated={deactivationStatus === "inactive"}
          setActiveTab={setActiveKycTab}
        />
      )
    },
    {
      title: <FormattedMessage defaultMessage="Salary Details" />,
      content: (
        <SalaryDetails
          state={salaryState}
          formProps={salaryFormProps}
          isDeactivated={deactivationStatus === "inactive"}
        />
      )
    },
    {
      title: <FormattedMessage defaultMessage="Bank Details" />,
      content: (
        <BankDetails
          state={bankState}
          formProps={bankFormProps}
          account={account}
          loader={loader}
          disabled={disabled}
          editMode={!!activeEmp}
          ibanModalVisible={ibanModalVisible}
          isDeactivated={deactivationStatus === "inactive"}
          showIbanModal={() => setIbanModalVisible(true)}
          closeIbanModal={handleAddIbanClose}
          handleAddIban={() => {
            handleBankNext();
            handleAddIbanClose();
          }}
        />
      )
    }
  ];

  const handleStepChange = async (step, isNext) => {
    if (step === panes.length) {
      handleBack();
    }
    if (isNext) {
      if (activeTab === 0) {
        handleEmpDetailsNext(step);
      } else if (activeTab === 1) {
        handleKycNext(step);
      } else if (activeTab === 2) {
        handleSalaryNext(step);
      } else if (activeTab === 3) {
        try {
          const res = await handleBankNext({
            iban: bankState.iban.value,
            selectedForPayroll: true
          });

          if (!!activeEmp) {
            setActiveTab(step);
          } else if (res && res.status === 200) {
            history.push(EMPLOYEE);
          }
        } catch (err) {
          throw err;
        }
      }
    } else {
      setActiveTab(step);
    }
  };

  return (
    <PermissionContext.Provider value={modulePermission}>
      <AddEmpComp
        deactivateModalVisible={deactivateModalVisible}
        closeDeactivationModal={closeDeactivationModal}
        handleActivationDeactivation={handleActivationDeactivation}
        deactivationLoader={deactivationLoader}
        pageLoader={pageLoader}
        deactivateEmp={deactivateEmp}
        panes={panes}
        deactivationStatus={deactivationStatus}
        editMode={!!activeEmp}
        pageTitle={pageTitle}
        activeTab={activeTab}
        loader={loader}
        disabled={disabled}
        handleBack={handleBack}
        handleCancel={handleCancel}
        handleStepChange={handleStepChange}
        payslipModalVisible={payslipModalVisible}
        submitBtnText={
          account && account.length > 0
            ? formatMessage({ defaultMessage: "Exit" })
            : formatMessage({ defaultMessage: "Save" })
        }
        setPayslipModalVisible={setPayslipModalVisible}
      />
    </PermissionContext.Provider>
  );
}
