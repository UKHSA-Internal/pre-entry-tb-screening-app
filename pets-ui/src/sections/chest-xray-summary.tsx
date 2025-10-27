import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { postChestXrayDetails } from "@/api/api";
import Button from "@/components/button/button";
import Heading from "@/components/heading/heading";
import Spinner from "@/components/spinner/spinner";
import Summary from "@/components/summary/summary";
import { setChestXrayStatus } from "@/redux/chestXraySlice";
import { useAppSelector } from "@/redux/hooks";
import { selectApplication, selectChestXray } from "@/redux/store";
import { ApplicationStatus, ButtonType, YesOrNo } from "@/utils/enums";
import {
  formatDateForDisplay,
  spreadArrayIfNotEmpty,
  standardiseDayOrMonth,
} from "@/utils/helpers";
import { attributeToComponentId } from "@/utils/records";

const ChestXraySummary = () => {
  const applicationData = useAppSelector(selectApplication);
  const chestXrayData = useAppSelector(selectChestXray);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const dateXrayTakenStr = `${chestXrayData.dateXrayTaken.year}-${standardiseDayOrMonth(chestXrayData.dateXrayTaken.month)}-${standardiseDayOrMonth(chestXrayData.dateXrayTaken.day)}`;
      await postChestXrayDetails(applicationData.applicationId, {
        chestXrayTaken: YesOrNo.YES,
        posteroAnteriorXrayFileName: chestXrayData.posteroAnteriorXrayFileName,
        posteroAnteriorXray: chestXrayData.posteroAnteriorXrayFile,
        apicalLordoticXrayFileName: chestXrayData.apicalLordoticXrayFileName || undefined,
        apicalLordoticXray: chestXrayData.apicalLordoticXrayFile || undefined,
        lateralDecubitusXrayFileName: chestXrayData.lateralDecubitusXrayFileName || undefined,
        lateralDecubitusXray: chestXrayData.lateralDecubitusXrayFile || undefined,
        dateXrayTaken: dateXrayTakenStr,
      });

      dispatch(setChestXrayStatus(ApplicationStatus.COMPLETE));
      navigate("/chest-x-ray-images-confirmed");
    } catch (error) {
      console.error(error);
      navigate("/sorry-there-is-problem-with-service");
    }
  };

  const summaryData = [
    {
      key: "Date of X-ray",
      value: formatDateForDisplay(chestXrayData.dateXrayTaken),
      link: `/upload-chest-x-ray-images#${attributeToComponentId.dateXrayTaken}`,
      hiddenLabel: "date of X-ray",
    },
    {
      key: "Chest X-ray images",
      value: spreadArrayIfNotEmpty(
        [chestXrayData.posteroAnteriorXrayFileName],
        [chestXrayData.apicalLordoticXrayFileName ?? ""],
        [chestXrayData.lateralDecubitusXrayFileName ?? ""],
      ),
      link: `/upload-chest-x-ray-images#${attributeToComponentId.posteroAnteriorXrayFileName}`,
      hiddenLabel: "chest X-rays",
    },
  ];

  return (
    <div>
      {isLoading && <Spinner />}
      <Summary status={chestXrayData.status} summaryElements={summaryData} />

      {(chestXrayData.status == ApplicationStatus.NOT_YET_STARTED ||
        chestXrayData.status == ApplicationStatus.IN_PROGRESS) && (
        <div>
          <Heading title="Now send the chest X-ray results and findings" level={2} size="m" />
          <p className="govuk-body">
            You will not be able to change the X-ray results and findings after you submit this
            information.
          </p>

          <Button
            id="confirm"
            type={ButtonType.DEFAULT}
            text="Save and continue"
            handleClick={handleSubmit}
          />
        </div>
      )}
      {(chestXrayData.status == ApplicationStatus.COMPLETE ||
        chestXrayData.status == ApplicationStatus.NOT_REQUIRED) && (
        <Button
          id="back-to-tracker"
          type={ButtonType.DEFAULT}
          text="Return to tracker"
          handleClick={() => navigate("/tracker")}
        />
      )}
    </div>
  );
};

export default ChestXraySummary;
