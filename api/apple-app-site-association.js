export default function handler(req, res) {
  res.setHeader("Content-Type", "application/json");

  res.status(200).json({
    applinks: {
      apps: [],
      details: [
        {
          appIDs: ["TON_TEAM_ID.com.meltmpc.hako-app"],
          components: [
            { "/": "/payment-success*" },
            { "/": "/payment-cancelled*" }
          ]
        }
      ]
    }
  });
}
