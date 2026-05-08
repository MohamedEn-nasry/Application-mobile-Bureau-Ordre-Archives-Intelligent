using DTO.PiecesJointes;
using BusinessLayer;

namespace backend.Services.Classification
{
    public class RuleBasedOcrClassificationService : IOcrClassificationService
    {
        public OcrClassificationDTO Classify(string texteOcr)
        {
            var text = Normalize(texteOcr);

            var categories = Categorie.GetAllCategories();

            var rules = new Dictionary<string, string[]>
{
    {
        "Human Resources",
        new[]
        {
            "conge", "congé", "absence", "employe", "employé",
            "ressources humaines", "rh", "recrutement",
            "salaire", "attestation de travail", "formation",
            "leave", "employee", "recruitment", "training"
        }
    },
    {
        "Financial",
        new[]
        {
            "budget", "facture", "paiement", "finance",
            "comptable", "tresorerie", "trésorerie",
            "devis", "montant", "virement",
            "invoice", "payment", "accounting"
        }
    },
    {
        "Legal",
        new[]
        {
            "juridique", "contrat", "plainte", "loi",
            "contentieux", "tribunal", "avocat",
            "reglement", "règlement", "mise en demeure",
            "contract", "dispute", "decision", "law"
        }
    },
    {
        "Technical",
        new[]
        {
            "technique", "technical", "maintenance",
            "informatique", "systeme", "système",
            "it", "reseau", "réseau", "serveur",
            "support technique", "panne"
        }
    },
    {
        "Administrative",
        new[]
        {
            "administratif", "administrative", "dossier",
            "demande", "autorisation", "attestation",
            "circulaire", "note interne",
            "internal management", "organization"
        }
    },
    {
        "Archive",
        new[]
        {
            "archive", "archivage", "stockage",
            "storage", "document archive",
            "classement", "conservation"
        }
    },
    {
        "External",
        new[]
        {
            "external", "externe", "entite externe",
            "entité externe", "incoming correspondence",
            "courrier entrant", "partenaire", "client",
            "fournisseur"
        }
    },
    {
        "Internal",
        new[]
        {
            "internal", "interne", "note interne",
            "correspondance interne", "within the organization",
            "service interne", "departement", "département"
        }
    }
};

            string? bestCategoryName = null;
            int bestScore = 0;
            List<string> bestKeywords = new();

            foreach (var rule in rules)
            {
                var matched = rule.Value
                    .Where(keyword => text.Contains(Normalize(keyword)))
                    .Distinct()
                    .ToList();

                if (matched.Count > bestScore)
                {
                    bestScore = matched.Count;
                    bestCategoryName = rule.Key;
                    bestKeywords = matched;
                }
            }

            if (bestCategoryName == null || bestScore == 0)
            {
                return new OcrClassificationDTO
                {
                    SuggestedCategorieId = null,
                    SuggestedCategorieName = null,
                    ScoreConfiance = 0,
                    Methode = "OCR_RULE_BASED",
                    MatchedKeywords = new List<string>(),
                    Message = "Aucune catégorie détectée automatiquement."
                };
            }

            var matchedCategory = categories.FirstOrDefault(c =>
                Normalize(c.Nom).Contains(Normalize(bestCategoryName)) ||
                Normalize(bestCategoryName).Contains(Normalize(c.Nom))
            );

            var confidence = Math.Min(95, 50 + bestScore * 15);

            return new OcrClassificationDTO
            {
                SuggestedCategorieId = matchedCategory?.Id,
                SuggestedCategorieName = matchedCategory?.Nom ?? bestCategoryName,
                ScoreConfiance = confidence,
                Methode = "OCR_RULE_BASED",
                MatchedKeywords = bestKeywords,
                Message = matchedCategory == null
                    ? "Catégorie détectée mais non trouvée dans la base."
                    : "Suggestion automatique basée sur le texte OCR."
            };
        }

        private static string Normalize(string value)
        {
            return value
                .ToLowerInvariant()
                .Replace("à", "a")
                .Replace("á", "a")
                .Replace("â", "a")
                .Replace("ä", "a")
                .Replace("ç", "c")
                .Replace("è", "e")
                .Replace("é", "e")
                .Replace("ê", "e")
                .Replace("ë", "e")
                .Replace("î", "i")
                .Replace("ï", "i")
                .Replace("ô", "o")
                .Replace("ö", "o")
                .Replace("ù", "u")
                .Replace("û", "u")
                .Replace("ü", "u");
        }
    }
}