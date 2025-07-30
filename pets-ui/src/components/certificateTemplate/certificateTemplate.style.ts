import { StyleSheet } from "@react-pdf/renderer";

export const styles = StyleSheet.create({
  page: {
    padding: "15px",
    fontFamily: "Helvetica",
    fontSize: 8,
    color: "#0b0c0c",
  },
  header: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    paddingBottom: 10,
    marginBottom: 15,
    borderBottom: "2px solid #0b0c0c",
  },
  headerLeft: {
    width: 150,
  },
  ukVisasLogo: {
    maxWidth: 150,
  },
  headerCenter: {
    flex: 1,
    alignSelf: "stretch",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "flex-end",
    padding: "0 20px",
  },
  mainTitle: {
    fontSize: 12,
    fontWeight: "bold",
    lineHeight: 1.2,
    color: "#0b0c0c",
  },
  headerRight: {
    width: 100,
  },
  headerImage: {
    width: 80,
    height: 100,
  },
  contentContainer: {
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
  },
  topContentRow: {
    display: "flex",
    flexDirection: "row",
    border: "1px solid #b1b4b6",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 5,
  },
  bottomContentRow: {
    display: "flex",
    flexDirection: "row",
    border: "1px solid #b1b4b6",
    borderRadius: 4,
    overflow: "hidden",
    width: "100%",
  },
  photoColumn: {
    width: "20%",
    borderRight: "1px solid #b1b4b6",
  },
  applicantPhoto: {
    width: 96,
    height: 116,
    objectFit: "cover",
    margin: "10px auto 0",
  },
  photoPlaceholder: {
    width: 96,
    height: 116,
    objectFit: "cover",
    margin: "10px auto",
  },
  contentColumn: {
    flex: 1,
    borderRight: "1px solid #b1b4b6",
  },
  bottomContentColumn: {
    width: "50%",
    borderRight: "1px solid #b1b4b6",
  },
  lastContentColumn: {
    borderRight: "none",
  },
  sectionHeader: {
    padding: "8px 12px",
    backgroundColor: "#0b0c0c",
    color: "white",
    fontWeight: "bold",
    fontSize: 9,
  },
  summarySection: {
    padding: 10,
  },
  summaryRow: {
    display: "flex",
    flexDirection: "row",
    padding: "4px 0",
    borderBottom: "1px solid #f3f2f1",
  },
  summaryKey: {
    width: "40%",
    fontSize: 8,
    color: "#505a5f",
  },
  summaryValue: {
    flex: 1,
    minHeight: 16,
    paddingBottom: 2,
    borderBottom: "1px solid #b1b4b6",
    fontSize: 8,
  },
  commentsSection: {
    paddingTop: 10,
    marginTop: 10,
    borderTop: "2px solid #b1b4b6",
  },
  commentsTitle: {
    marginBottom: 4,
    fontSize: 9,
    fontWeight: "bold",
  },
  commentsContent: {
    padding: 5,
    border: "2px solid #b1b4b6",
    borderRadius: 4,
    lineHeight: 1.2,
  },
});
