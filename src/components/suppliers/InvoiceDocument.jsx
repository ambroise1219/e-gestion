import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccff00',
  },
  logo: {
    width: 150,
    height: 'auto',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1a1a1a',
  },
  subtitle: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 5,
  },
  section: {
    margin: 10,
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 5,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1a1a1a',
  },
  table: {
    display: 'table',
    width: '100%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 5,
    marginVertical: 20,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
    minHeight: 35,
    alignItems: 'center',
  },
  tableHeader: {
    backgroundColor: '#ccff00',
  },
  tableHeaderCell: {
    padding: 10,
    flex: 1,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  tableCell: {
    padding: 10,
    flex: 1,
    fontSize: 11,
    color: '#4a4a4a',
  },
  total: {
    marginTop: 30,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#ccff00',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 10,
  },
  totalLabel: {
    fontSize: 12,
    marginRight: 20,
    color: '#666666',
  },
  totalValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1a1a1a',
    width: 150,
    textAlign: 'right',
  },
  totalTTC: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  pageContent: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
  }
});

const formatNumber = (number) => {
  return number.toLocaleString('fr-FR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
};

const InvoiceDocument = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.pageContent}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>FACTURE</Text>
            <Text style={styles.subtitle}>N° {data.invoiceNumber}</Text>
            <Text style={styles.subtitle}>Date: {data.date}</Text>
            <Text style={styles.subtitle}>Échéance: {data.dueDate}</Text>
          </View>
          {data.logo && <Image style={styles.logo} src={data.logo} />}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fournisseur</Text>
          <Text style={styles.subtitle}>{data.supplier.name}</Text>
          <Text style={styles.subtitle}>{data.supplier.address}</Text>
          <Text style={styles.subtitle}>SIRET: {data.supplier.siret}</Text>
          <Text style={styles.subtitle}>TVA: {data.supplier.vatNumber}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Entreprise</Text>
          <Text style={styles.subtitle}>{data.company.name}</Text>
          <Text style={styles.subtitle}>{data.company.address}</Text>
          <Text style={styles.subtitle}>{data.company.city} {data.company.postalCode}</Text>
          <Text style={styles.subtitle}>{data.company.country}</Text>
        </View>

        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={styles.tableHeaderCell}>Description</Text>
            <Text style={styles.tableHeaderCell}>Quantité</Text>
            <Text style={styles.tableHeaderCell}>Prix unitaire</Text>
            <Text style={styles.tableHeaderCell}>Total HT</Text>
          </View>
          {data.items.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.tableCell}>{item.description}</Text>
              <Text style={styles.tableCell}>{item.quantity}</Text>
              <Text style={styles.tableCell}>{formatNumber(item.unitPrice)} CFA</Text>
              <Text style={styles.tableCell}>{formatNumber(item.quantity * item.unitPrice)} CFA</Text>
            </View>
          ))}
        </View>

        <View style={styles.total}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total HT</Text>
            <Text style={styles.totalValue}>{formatNumber(data.totalHT)} CFA</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>TVA ({data.tvaRate}%)</Text>
            <Text style={styles.totalValue}>{formatNumber(data.tvaAmount)} CFA</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={[styles.totalLabel, styles.totalTTC]}>Total TTC</Text>
            <Text style={[styles.totalValue, styles.totalTTC]}>{formatNumber(data.totalTTC)} CFA</Text>
          </View>
        </View>
      </View>
    </Page>
  </Document>
);

export default InvoiceDocument;
