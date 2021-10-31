import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useIntl } from "react-intl";
import usePrevious from "../../hooks/usePrevious";
import { getInvoiceDetails } from "../../redux/business/action";
import InvoiceDetailsComp from "../../components/invoiceDetails";
import { apiCallDate } from "../../utils";

const PAGE_SIZE = 20;

export default function InvoiceDetails() {
  const intl = useIntl();
  const dispatch = useDispatch();

  const [invoices, setInvoices] = useState();
  const [loading, setLoading] = useState(false);
  const [initLoad, setInitLoad] = useState(false);
  const [noData, setNoData] = useState(false);
  const [pageReset, setPageReset] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [morePages, setMorePages] = useState(false);
  const [tid, setTid] = useState();
  const [sortBy, setSortBy] = useState();
  const [status, setStatus] = useState();
  const [product, setProduct] = useState();
  const [fromDate, setFromDate] = useState();
  const [toDate, setToDate] = useState();

  const prevPage = usePrevious(currentPage);

  const allInvoiceDetails = useSelector(state => state.business.invoice);

  const statusOptions = [
    {
      id: 0,
      name: intl.formatMessage({ defaultMessage: "Pending" })
    },
    {
      id: 1,
      name: intl.formatMessage({ defaultMessage: "Paid" })
    },
    {
      id: 2,
      name: intl.formatMessage({ defaultMessage: "All" })
    }
  ];
  const productOptions = [
    {
      id: 1,
      name: intl.formatMessage({ defaultMessage: "POS" })
    }
  ];
  useEffect(() => {
    setMorePages(allInvoiceDetails && allInvoiceDetails.length === PAGE_SIZE);

    if (!invoices && (!allInvoiceDetails || allInvoiceDetails.length === 0)) {
      setNoData(true);
    } else {
      setNoData(false);
      setInvoices(
        pageReset
          ? [...(allInvoiceDetails || [])]
          : [...(invoices || []), ...(allInvoiceDetails || [])]
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allInvoiceDetails]);

  useEffect(() => {
    if (pageReset) {
      setCurrentPage(0);
      setMorePages(true);
    }
  }, [pageReset]);

  useEffect(() => {
    const fetchInvoiceDetails = async () => {
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
          await dispatch(getInvoiceDetails());
        } catch (err) {
          throw err;
        } finally {
          setLoading(false);
          setInitLoad(false);
        }
      }
    };

    fetchInvoiceDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, sortBy, dispatch, product, status, fromDate, toDate, tid]);

  const handleInvoiceTerminal = e => {
    setTid(e.value);
  };

  const handleSort = ({ selector }, direction) => {
    setSortBy(`${selector}:${direction}`);
  };
  const handleStatusChange = e => {
    setStatus(e.target.value);
  };
  const handleProductChange = e => {
    setProduct(e.target.value);
  };

  const handleFromDateChange = date => {
    setFromDate(date);
    if (Date.parse(date) > Date.parse(toDate)) {
      setToDate("");
    }
  };

  const handleToDateChange = date => {
    setToDate(date);
  };

  const handleNextPage = () => {
    if (morePages) {
      setCurrentPage(current => current + 1);
    }
  };

  return (
    <InvoiceDetailsComp
      noData={noData}
      toDate={toDate}
      data={invoices}
      loading={loading}
      initLoad={initLoad}
      fromDate={fromDate}
      handleSort={handleSort}
      statusOptions={statusOptions}
      productOptions={productOptions}
      handleNextPage={handleNextPage}
      handleStatusChange={handleStatusChange}
      handleToDateChange={handleToDateChange}
      handleProductChange={handleProductChange}
      handleFromDateChange={handleFromDateChange}
      handleInvoiceTerminal={handleInvoiceTerminal}
    />
  );
}
