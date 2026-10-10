package main

import (
	"encoding/json"
	"log"
	"net/http"
	"os"
)

type quoteRequest struct {
	CountryCode        string  `json:"country_code"`
	TotalUnits         int     `json:"total_units"`
	DeclaredValueUSD   float64 `json:"declared_value_usd"`
}

type quoteResponse struct {
	CountryCode              string  `json:"country_code"`
	ShippingUSD              float64 `json:"shipping_usd"`
	DutiesEstimateUSD        float64 `json:"duties_estimate_usd"`
	DocumentationFeeUSD      float64 `json:"documentation_fee_usd"`
	TotalLandedEstimateUSD   float64 `json:"total_landed_estimate_usd"`
	EtaDays                  int     `json:"eta_days"`
	Currency                 string  `json:"currency"`
	Service                  string  `json:"service"`
}

var dutyRates = map[string]float64{
	"US": 0.12,
	"GB": 0.08,
	"DE": 0.09,
	"AE": 0.05,
	"AU": 0.10,
	"CA": 0.11,
	"FR": 0.09,
	"SG": 0.06,
}

func computeQuote(req quoteRequest) quoteResponse {
	rate := dutyRates[req.CountryCode]
	if rate == 0 {
		rate = 0.10
	}
	weightFactor := (req.TotalUnits + 49) / 50
	shipping := 80.0 + float64(weightFactor)*40.0
	duties := req.DeclaredValueUSD * rate
	docs := 50.0
	total := shipping + duties + docs + req.DeclaredValueUSD
	eta := 9
	if req.CountryCode == "AE" || req.CountryCode == "SG" {
		eta = 5
	}
	return quoteResponse{
		CountryCode:            req.CountryCode,
		ShippingUSD:            shipping,
		DutiesEstimateUSD:      duties,
		DocumentationFeeUSD:    docs,
		TotalLandedEstimateUSD: total,
		EtaDays:                eta,
		Currency:               "USD",
		Service:                "beltforge-export-go",
	}
}

func withCORS(w http.ResponseWriter) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
}

func quoteHandler(w http.ResponseWriter, r *http.Request) {
	withCORS(w)
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusNoContent)
		return
	}
	if r.Method != http.MethodPost {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}
	var req quoteRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid json", http.StatusBadRequest)
		return
	}
	if req.CountryCode == "" || req.TotalUnits <= 0 || req.DeclaredValueUSD <= 0 {
		http.Error(w, "missing fields", http.StatusBadRequest)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(w).Encode(computeQuote(req))
}

func healthHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	_, _ = w.Write([]byte(`{"status":"ok","service":"beltforge-export-go"}`))
}

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8081"
	}
	mux := http.NewServeMux()
	mux.HandleFunc("/health", healthHandler)
	mux.HandleFunc("/quote", quoteHandler)
	log.Printf("export-api listening on :%s", port)
	log.Fatal(http.ListenAndServe(":"+port, mux))
}
