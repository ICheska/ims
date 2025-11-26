export const userSummary = async (req, res) => {
  try {
    res.json({
      todaysSales: 0,
      transactions: 0,
      lowStock: []  // <-- must ALWAYS exist
    });
  } catch (err) {
    console.error("User dashboard error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


