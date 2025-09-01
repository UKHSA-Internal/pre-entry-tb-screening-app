import { StyleSheet } from "@react-pdf/renderer";

export const styles = StyleSheet.create({
  page: {
    padding: 18,
    fontSize: 9,
    color: "#000000",
    display: "flex",
    flexDirection: "column",
  },
  headerText: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 8,
  },
  headerLogoBlock: {
    width: 100,
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  ukVisasLogo: {
    width: 110,
  },
  layoutColumns: {
    display: "flex",
    flexDirection: "row",
    gap: 12,
    flexGrow: 1,
    alignItems: "stretch",
  },
  col: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: 20,
    justifyContent: "flex-start",
  },
  photoBox: {
    border: "1.5px solid #000",
    height: 200,
    width: 150,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: "auto",
  },
  photo: {
    width: 120,
    height: 168,
    objectFit: "cover",
  },
  photoPlaceholderText: {
    fontSize: 14,
    color: "#bbb",
  },
  box: {
    border: "1.5px solid #000",
    padding: 14,
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
  },
  boxTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 6,
  },
  boxSubtitle: {
    fontSize: 12,
    marginBottom: 8,
  },
  field: {
    marginBottom: 10,
  },
  label: {
    fontSize: 11,
    marginBottom: 2,
  },
  valueBox: {
    border: "1.5px solid #000",
    minHeight: 22,
    padding: "5px 7px",
    fontSize: 11,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  inlineRow: {
    display: "flex",
    flexDirection: "row",
    gap: 2,
  },
  half: {
    flex: 1,
  },
});
