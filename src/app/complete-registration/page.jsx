"use client";
import React, { useEffect, useState } from "react";
import CurrentForm from "@/components/CompleteRegistration/CurrentForm";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import MyLoader from "@/components/Loader/MyLoader";
// import useSWR from "swr";
const FinishRegistration = () => {
  const session = useSession();
  const router = useRouter();

  const [currentForm, setCurrentForm] = useState(1);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [info, setInfo] = useState({
    address: "",
    nationality: "",
    subjects: [],
    date_of_birth: "",
    gender: "",
    ethnicity: "",
    mobile: "",
    highest_level_of_education: "",
    year_of_completion: "",
    duration_of_study: "",
    occupation: "",
    marital_status: "",
    parent_guardian_name: "",
    relationship_to_applicant: "",
    contact_of_parent: "",
    nationality_of_parent: "",
    parent_guardian_name_2: "",
    relationship_to_applicant_2: "",
    contact_of_parent_2: "",
    nationality_of_parent_2: "",
  });

  useEffect(() => {
    session.data?.user?.registrationStatus === "complete"
      ? router.replace(`/dashboard/account`)
      : null;
    session.status === "unauthenticated" ? router.replace("/login") : null;
  }, [session.status, session.data?.user?.registrationStatus, router]);
  //
  // console.log(session.data);
  const handleNext = () => {
    currentForm > 0 ? setCurrentForm((prev) => prev + 1) : null;
    setInfo((prev) => ({ ...prev, subjects: [...selectedSubjects] }));
  };
  //
  const handlePrevious = () => {
    currentForm !== 0 ? setCurrentForm((prev) => prev - 1) : null;
  };
  //
  const updateSubs = (arr) => {
    setInfo((prev) => ({ ...prev, subjects: [...arr] }));
  };
  //
  const handleInputChange = (event) => {
    setInfo((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };
  //
  const isFormValid = (obj) => {
    const isValid = Object.values(obj).every((item) => item.trim() !== "");
    // console.log(isValid);
    return isValid;
  };
  // console.log(info);
  const updateSession = async () => {
    // Never update session like this again 😂
    // if(session) session.data?.user?.registrationStatus = "complete"
    try {
      // Assuming that session.update returns a promise
      await session.update({
        ...session.data,
        user: {
          ...session.data.user,
          registrationStatus: "complete",
        },
      });

      // Assuming that router.replace returns a promise as well
      await router.replace("/dashboard/account");
    } catch (error) {
      console.error("Error updating session:", error);
      // Handle the error as needed
    }
  };
  //
  const finishRegistration = async () => {
    setIsLoading((prev) => !prev);
    try {
      const res = await fetch("/api/complete-registration", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...info,
          _id: session.data?.user?._id,
          registrationStatus: "complete",
        }),
      });
      // console.log(res);

      res.ok
        ? (await updateSession(), setIsLoading((prev) => !prev))
        : (alert("Failed to Submit"), setIsLoading((prev) => !prev));
    } catch (err) {
      setIsLoading((prev) => false);
      console.log(err);
    }
  };

  if (session.status === "loading")
    return (
      <div className="w-full h-full flex items-center justify-center">
        <MyLoader />
      </div>
    );
  return (
    <div className="flex flex-col items-center">
      <CurrentForm
        info={info}
        setInfo={setInfo}
        handleInputChange={handleInputChange}
        updateSubs={updateSubs}
        currentForm={currentForm}
        handleNext={handleNext}
        handlePrevious={handlePrevious}
        finishRegistration={finishRegistration}
        isFormValid={isFormValid}
        selectedSubjects={selectedSubjects}
        setSelectedSubjects={setSelectedSubjects}
        isLoading={isLoading}
      />
    </div>
  );
};

export default FinishRegistration;
