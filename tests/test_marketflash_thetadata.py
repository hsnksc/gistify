import os
import sys
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch


sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))
import marketflash_marketdata_pipeline as pipeline


def theta_rows(symbol_offset: float):
    return [
        {
            "created": "2026-07-09T17:15:00.000",
            "open": 100 + symbol_offset,
            "high": 103 + symbol_offset,
            "low": 99 + symbol_offset,
            "close": 102 + symbol_offset,
            "volume": 1_000_000,
            "bid": 101.9 + symbol_offset,
            "ask": 102.1 + symbol_offset,
        },
        {
            "created": "2026-07-10T17:15:00.000",
            "open": 102 + symbol_offset,
            "high": 106 + symbol_offset,
            "low": 101 + symbol_offset,
            "close": 105 + symbol_offset,
            "volume": 1_500_000,
            "bid": 104.9 + symbol_offset,
            "ask": 105.1 + symbol_offset,
        },
    ]


class ThetaDataMarketFlashTests(unittest.TestCase):
    @patch.object(pipeline.time, "sleep")
    @patch.object(pipeline, "_thetadata_request_eod")
    def test_builds_quotes_and_resampled_bars(self, request_eod, _sleep):
        request_eod.side_effect = [theta_rows(0), theta_rows(10)]
        with patch.dict(
            os.environ,
            {
                "MARKETFLASH_THETADATA_MAX_TICKERS": "10",
                "THETADATA_REQUEST_GAP_MS": "0",
            },
        ):
            quotes, bars = pipeline.fetch_thetadata_market_data(["SPY", "AAPL"])

        self.assertEqual(set(quotes), {"SPY", "AAPL"})
        self.assertAlmostEqual(quotes["SPY"].last, 105)
        self.assertGreater(quotes["SPY"].changepct, 0)
        self.assertEqual(len(bars["AAPL"].daily), 2)
        self.assertEqual(len(bars["AAPL"].weekly), 1)
        self.assertEqual(len(bars["AAPL"].monthly), 1)

    def test_atomic_json_writer_leaves_a_complete_artifact(self):
        with tempfile.TemporaryDirectory() as directory:
            output = Path(directory) / "marketflash_report.json"
            pipeline._write_json_atomic(output, {"callSetups": [1], "putSetups": [2]})

            self.assertEqual(
                output.read_text(encoding="utf-8").strip()[0],
                "{",
            )
            self.assertEqual(list(output.parent.glob("*.tmp")), [])


if __name__ == "__main__":
    unittest.main()
