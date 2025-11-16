// Mock KPI data and revenue (align with your front-end values)
const mockKPIs = {
  revenue: 985620,
  users: 1540,
  traffic: 54000,
  issues: 12
};

const MOCK_REVENUE_DATA = [
  { month: 'Jan', value: 75000 },
  { month: 'Feb', value: 82000 },
  { month: 'Mar', value: 95000 },
  { month: 'Apr', value: 105000 },
  { month: 'May', value: 120000 },
  { month: 'Jun', value: 110000 },
  { month: 'Jul', value: 135000 }
];

function getKpis(req, res) {
  res.json({ success: true, data: mockKPIs });
}

function getRevenue(req, res) {
  res.json({ success: true, data: MOCK_REVENUE_DATA });
}

module.exports = { getKpis, getRevenue };