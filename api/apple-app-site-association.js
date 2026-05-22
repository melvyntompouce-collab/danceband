export default function handler(req, res) {
  res.setHeader("Content-Type", "application/json");

  res.status(200).json({
    applinks: {
      apps: [],
      details: [
        {
          appIDs: ["4FX5UKQRR3.com.meltmpc.hako-app"],
          components: [
            { "/": "/payment-success*" },
            { "/": "/payment-cancelled*" }
          ]
        }
      ]
    }
  });
}
