import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  createDepartment,
  getDepartments,
  deleteDepartment
} from "../../redux/departments/action";

import DepartmentComp from "../../components/department";

function Department() {
  const dispatch = useDispatch();

  const [searchText, setSearchText] = useState("");
  const [parentDepartmentId, setParentDepartmentId] = useState("");
  const [activeId, setActiveId] = useState("");
  const [departmentName, setDepartmentName] = useState("");
  const [loading, setLoading] = useState(true);
  const [showAddDepartmentModal, setShowAddDepartmentModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const departments = useSelector(state => state.departments.departments);

  useEffect(() => {
    dispatch(getDepartments({ search: searchText })).finally(() => {
      setLoading(false);
    });
  }, [searchText, dispatch]);

  useEffect(() => {
    if (departments) {
      let found = false;

      for (let i = 0; i < departments.length; i++) {
        if (departments[i].isRoot) {
          found = true;
          setParentDepartmentId(departments[i].departmentId);
          break;
        }
      }

      if (!found) {
        setParentDepartmentId(departments[0].departmentId);
      }
    }
  }, [departments]);

  const handleNameChange = value => {
    setDepartmentName(value);
  };

  const handleCreateDepartment = async () => {
    try {
      setLoading(true);

      await dispatch(createDepartment({ parentDepartmentId, departmentName }));

      setDepartmentName("");
      setShowAddDepartmentModal(false);
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDepartment = async () => {
    try {
      setLoading(true);

      await dispatch(deleteDepartment(activeId));

      setActiveId(undefined);
      setShowDeleteModal(false);
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitSearch = text => {
    setSearchText(text);
  };

  return (
    <DepartmentComp
      loading={loading}
      departmentName={departmentName}
      departments={departments}
      setActiveId={setActiveId}
      setShowDeleteModal={setShowDeleteModal}
      showDeleteModal={showDeleteModal}
      showAddDepartmentModal={showAddDepartmentModal}
      setShowAddDepartmentModal={setShowAddDepartmentModal}
      deleteDepartment={handleDeleteDepartment}
      createDepartment={handleCreateDepartment}
      handleSubmitSearch={handleSubmitSearch}
      handleNameChange={handleNameChange}
    />
  );
}

export default Department;
