import {
  AdditionalStatusTagTexts,
  ApplicationStatus,
  StatusTagText,
  TaskStatus,
} from "@/utils/enums";

export interface StatusTagProps {
  status: StatusTagText;
  textOverride?: string;
  classOverride?: string;
  taskListWrapper?: boolean;
}

export default function StatusTag(props: Readonly<StatusTagProps>) {
  let tagText = props.textOverride ?? props.status;
  if (!props.textOverride) {
    switch (props.status) {
      case ApplicationStatus.IN_PROGRESS:
        tagText = TaskStatus.IN_PROGRESS;
        break;
      case ApplicationStatus.CERTIFICATE_NOT_ISSUED:
        tagText = TaskStatus.CERTIFICATE_NOT_ISSUED;
        break;
      case ApplicationStatus.CERTIFICATE_AVAILABLE:
        tagText = TaskStatus.CERTIFICATE_ISSUED;
        break;
      case ApplicationStatus.CANCELLED:
        tagText = AdditionalStatusTagTexts.SCREENING_CANCELLED;
        break;
    }
  }

  let tagClass = props.classOverride ?? "";
  if (!props.classOverride) {
    switch (props.status) {
      case TaskStatus.NOT_YET_STARTED:
        tagClass = "govuk-tag govuk-tag--blue";
        break;
      case TaskStatus.NOT_REQUIRED:
      case AdditionalStatusTagTexts.CANNOT_START_YET:
        tagClass = "govuk-tag govuk-tag--grey";
        break;
      case TaskStatus.IN_PROGRESS:
      case ApplicationStatus.IN_PROGRESS:
        tagClass = "govuk-tag govuk-tag--yellow";
        break;
      case ApplicationStatus.CANCELLED:
        tagClass = "govuk-tag govuk-tag--orange progress-tracker-task-nowrap";
        break;
      case TaskStatus.CERTIFICATE_NOT_ISSUED:
      case ApplicationStatus.CERTIFICATE_NOT_ISSUED:
        tagClass = "govuk-tag govuk-tag--red progress-tracker-task-nowrap";
        break;
      case TaskStatus.CERTIFICATE_ISSUED:
      case ApplicationStatus.CERTIFICATE_AVAILABLE:
        tagClass = "govuk-tag govuk-tag--green";
        break;
    }
  }

  if (props.taskListWrapper) {
    return (
      <div className="govuk-task-list__status">
        <strong className={tagClass}>{tagText}</strong>
      </div>
    );
  } else {
    return <strong className={tagClass}>{tagText}</strong>;
  }
}
