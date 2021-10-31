import React, { useEffect, useState, createContext, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { useIntl } from "react-intl";

import EmployeeComp from "../../components/employee";
import { useFilters } from "../../components/common";
import CONSTANTS from "../../constants";
import { getRoute } from "../../utils";
import usePrevious from "../../hooks/usePrevious";
import useMessage from "../../hooks/useMessage";
import useQueryParams from "../../hooks/useQueryParams";

import {
  getEmployees,
  moveEmpolyee,
  resetEmp
} from "../../redux/employees/action";
import { getDepartments } from "../../redux/departments/action";
import { columns } from "../../components/employee";

const {
  KYC_STATUS_ICONS,
  ROUTES: { EDIT_EMPLOYEE }
} = CONSTANTS;
const EMPLOYEE_TABLE_PAGE_SIZE = 20;

const toOptionMap = (options, key, value) => {
  const res = {};

  options.forEach(option => {
    res[option[key]] = option[value];
  });

  return res;
};

export const PermissionContext = createContext({});

export default function Employee({ modulePermission }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const message = useMessage();
  const intl = useIntl();

  const documentOptions = [
    { id: 0, name: intl.formatMessage({ defaultMessage: "All Documents" }) },
    { id: 30, name: intl.formatMessage({ defaultMessage: "Passport" }) }, // will come from config
    { id: 5, name: intl.formatMessage({ defaultMessage: "QID" }) },
    { id: 35, name: intl.formatMessage({ defaultMessage: "VISA" }) }
  ];

  const kycStatusOptions = [
    {
      id: 0,
      text: intl.formatMessage({
        defaultMessage: "All KYC Status"
      })
    }
  ];

  for (const id in KYC_STATUS_ICONS) {
    kycStatusOptions.push({ id, ...KYC_STATUS_ICONS[id] });
  }

  kycStatusOptions.sort((x, y) => (x.text > y.text ? 1 : -1));

  const [employees, setEmployees] = useState();
  const [department, setDepartment] = useState(0);
  const [documentType, setDocumentType] = useState(0);
  const [kycStatus, setKycStatus] = useState(0);
  const [sortBy, setSortBy] = useState("firstName");
  const [currentPage, setCurrentPage] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [initLoad, setInitLoad] = useState(true);
  const [morePages, setMorePages] = useState(false);
  const [noData, setNoData] = useState(false);
  const [showMoveTo, setShowMoveTo] = useState(false);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [pageReset, setPageReset] = useState(true);
  const [clearRows, setClearRows] = useState(false);

  const prevPage = usePrevious(currentPage);

  const allDepartments = useSelector(state => state.departments.departments);
  const allEmployees = useSelector(state => state.employees.employees);

  const generateFilters = useCallback(() => {
    return [
      {
        key: "searchText",
        name: "Showing results for",
        value: searchText,
        set: setSearchText,
        default: ""
      },
      {
        key: "department",
        name: "Department",
        value: department,
        set: setDepartment,
        default: "0"
      },
      {
        key: "documentType",
        name: "Document",
        value: documentType,
        set: setDocumentType,
        default: 0,
        options: toOptionMap(documentOptions, "id", "name")
      },
      {
        key: "kycStatus",
        name: "Kyc Status",
        value: kycStatus,
        set: setKycStatus,
        default: 0,
        options: toOptionMap(kycStatusOptions, "id", "text")
      },
      {
        key: "sortBy",
        name: "Sorting By",
        value: sortBy,
        isSort: true,
        set: setSortBy,
        default: "firstName",
        options: toOptionMap(columns(intl), "selector", "name")
      }
    ];
  }, [department, documentType, kycStatus, sortBy, searchText, columns]);

  const filters = useFilters(generateFilters);
  useQueryParams(generateFilters);

  useEffect(() => {
    dispatch(getDepartments());
    return () => {
      dispatch(resetEmp());
    };
  }, [dispatch]);

  useEffect(() => {
    setMorePages(
      allEmployees && allEmployees.length === EMPLOYEE_TABLE_PAGE_SIZE
    );

    if (!employees && (!allEmployees || allEmployees.length === 0)) {
      setNoData(true);
    } else {
      setNoData(false);
      setEmployees(
        pageReset
          ? [...(allEmployees || [])]
          : [...(employees || []), ...(allEmployees || [])]
      );
    }
  }, [allEmployees]);

  useEffect(() => {
    if (pageReset) {
      setCurrentPage(0);
      setMorePages(true);
    }
  }, [pageReset]);

  useEffect(() => {
    const fetchEmployees = async () => {
      if (
        !(
          currentPage !== prevPage &&
          prevPage !== undefined &&
          currentPage === 0
        )
      ) {
        try {
          if (currentPage !== prevPage ? currentPage : 0) {
            setLoading(true);
          } else {
            setInitLoad(true);
          }

          setPageReset(currentPage === prevPage);

          await dispatch(
            getEmployees({
              kycStatus,
              department,
              documentType,
              sort: sortBy,
              search: searchText,
              pageNumber: currentPage !== prevPage ? currentPage : 0,
              pageSize: EMPLOYEE_TABLE_PAGE_SIZE
            })
          );
        } catch (err) {
          throw err;
        } finally {
          setLoading(false);
          setInitLoad(false);
        }
      }
    };

    fetchEmployees();
  }, [
    department,
    documentType,
    kycStatus,
    currentPage,
    sortBy,
    searchText,
    dispatch
  ]);

  const handleDepartmentChange = e => {
    setDepartment(e.target.value);
  };

  const handleMoveDepartmentChange = async e => {
    try {
      setLoading(true);
      await dispatch(
        moveEmpolyee({
          departmentId: e.target.value,
          employeeIds: selectedEmployees
        })
      );
      message.success(
        intl.formatMessage({
          defaultMessage: "Employee moved successfuly."
        })
      );
    } catch (err) {
      message.error(
        intl.formatMessage({
          defaultMessage: "Moving employee failed, please try again later."
        })
      );
      throw err;
    } finally {
      setLoading(false);
      setShowMoveTo(false);
      handleClearSelectedRows();
    }
  };

  const handleClearSelectedRows = () => {
    setClearRows(!clearRows);
  };

  const handleDocumentTypeChange = e => {
    setDocumentType(e.target.value);
  };

  const handleKycStatusChange = e => {
    setKycStatus(e.target.value);
  };

  const handleSort = ({ selector }, direction) => {
    setSortBy(`${selector} ${direction}`);
  };

  const handleSearch = searchText => {
    setSearchText(searchText);
  };

  const handleSelectedRowChange = e => {
    setShowMoveTo(e.selectedCount > 0);
    setSelectedEmployees(e.selectedRows.map(row => row.uid));
  };

  const handleNextPage = () => {
    if (morePages) {
      setCurrentPage(current => current + 1);
    }
  };

  const handleRowClick = ({ uid }) => {
    history.push({ pathname: getRoute(EDIT_EMPLOYEE, { id: uid }) });
  };

  return (
    <PermissionContext.Provider value={modulePermission}>
      <EmployeeComp
        pageLoading={!employees && initLoad}
        documentOptions={documentOptions}
        kycStatusOptions={kycStatusOptions}
        employees={employees}
        initLoad={initLoad}
        loading={loading}
        noData={noData}
        handleSort={handleSort}
        handleNextPage={handleNextPage}
        allDepartments={allDepartments}
        department={department}
        documentType={documentType}
        kycStatus={kycStatus}
        searchText={searchText}
        handleSearch={handleSearch}
        handleDepartmentChange={handleDepartmentChange}
        handleMoveDepartmentChange={handleMoveDepartmentChange}
        handleDocumentTypeChange={handleDocumentTypeChange}
        handleKycStatusChange={handleKycStatusChange}
        showMoveTo={showMoveTo}
        handleRowClick={handleRowClick}
        handleSelectedRowChange={handleSelectedRowChange}
        clearSelectedRows={clearRows}
        filters={filters}
      />
    </PermissionContext.Provider>
  );
}
