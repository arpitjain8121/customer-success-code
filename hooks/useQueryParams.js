import { useState, useEffect, useMemo } from "react";
import { useHistory, useLocation } from "react-router-dom";
import qs from "querystring";

import { arrayToObject } from "../utils";

export default generateFilters => {
  const history = useHistory();
  const { search } = useLocation();

  const _filters = generateFilters() || [];

  const [query, setQuery] = useState();

  const _filtersObj = useMemo(() => arrayToObject(_filters, "key"), _filters);

  const getQuery = filters => {
    const filtersObj = {};

    filters.forEach(filter => {
      filtersObj[filter.key] = filter.value;
    });

    return qs.stringify(filtersObj);
  };

  useEffect(() => {
    if (search.slice(1) !== query) {
      const fields = qs.parse(search.slice(1));

      for (const key in _filtersObj) {
        const value = fields[key] ?? _filtersObj[key].default;
        _filtersObj[key]?.set(value);
      }
    }
  }, [search]);

  useEffect(() => {
    const q = getQuery(_filters);
    if (query !== q) {
      setQuery(q);
    }
  }, [_filters]);

  useEffect(() => {
    history.push({ search: query });
  }, [query]);
};
