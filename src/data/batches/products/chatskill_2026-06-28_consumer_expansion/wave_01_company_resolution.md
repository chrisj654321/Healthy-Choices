# Wave 01 Company Resolution

Status: initial company resolver pass complete

## Summary

Most Wave 1 parent companies already exist locally, but several targets need
extra care before code writing:

- Hamburger Helper is not General Mills anymore; General Mills completed the
  sale of Helper and Suddenly Salad to Eagle Family Foods on July 5, 2022.
- Trident Seafoods must not be mapped through the existing `trident` gum mapping
  to Mondelez.
- Gorton's likely needs a Nissui ownership path/company entry.
- Butterball has local ownership ambiguity: `butterball` exists, while JBS data
  also references Butterball. Verify current parent before writing.
- Tasty Bite likely maps to Mars, but current local brand maps do not include it.

## Product-Level Resolution

| Slot | Target product | Likely companyId | Fresh enough to skip deep analysis? | Brand mapping exists? | Verify / overlap notes |
|---:|---|---|---|---|---|
| 1 | Velveeta Shells & Cheese Original | `kraft-heinz` | Yes | Yes, `velveeta` | Overlaps existing Kraft Mac & Cheese category; no exact Velveeta product found. |
| 2 | Annie's Organic Shells & Real Aged Cheddar | `general-mills` | Yes | No | Existing Annie's products manually use `general-mills`; add/verify map. |
| 3 | Kraft Deluxe Original Cheddar Mac & Cheese | `kraft-heinz` | Yes | Yes, `kraft` | High overlap with existing `Kraft Macaroni & Cheese Original`; verify Deluxe UPC/14 oz. |
| 4 | Hamburger Helper Cheeseburger Macaroni | none existing | No | No | Target note said General Mills, but Helper/Suddenly Salad was sold to Eagle Family Foods in 2022. Needs new company entry or verified existing alias. |
| 5 | Rice-A-Roni Chicken Flavor Rice | `pepsico` likely | Yes | No | Parent likely Quaker/PepsiCo, but local map lacks Rice-A-Roni; verify current ownership. |
| 6 | Knorr Pasta Sides Alfredo | `unilever` | Yes | Yes, `knorr` | No exact product overlap found. |
| 7 | Chef Boyardee Beef Ravioli | `conagra` | Mostly yes | No | Conagra entry exists; verify whether freshness threshold requires update. |
| 8 | Hormel Compleats Chicken Alfredo | `hormel` | Yes | Implicit via `hormel`, not explicit `compleats` | No exact Compleats overlap found. |
| 9 | Tasty Bite Madras Lentils | `mars` likely | Yes if Mars confirmed | No | Mars ownership should be verified for current U.S. product; local Mars map lacks Tasty Bite. |
| 10 | Ben's Original Ready Rice Jasmine | `mars` | Yes | Yes, `ben's original` | Overlaps existing Ben's Original Ready Rice Whole Grain Brown; verify Jasmine UPC/variant. |
| 11 | Tyson Boneless Skinless Chicken Breast Tenderloins | `tyson` | Yes | Yes, `tyson` | Existing Tyson-owned products, but no exact chicken tenderloin product found. |
| 12 | Perdue Short Cuts Carved Chicken Breast Original Roasted | `perdue` | Yes | Yes, `perdue` | No exact Perdue product found. |
| 13 | Butterball 93% Lean Ground Turkey | `butterball` | Yes | Yes, `butterball` | Ownership ambiguity with JBS references; verify true parent. |
| 14 | Jennie-O 93% Lean Ground Turkey | `hormel` | Yes | Yes, `jennie-o` | Product overlap with Butterball ground turkey target; keep distinct UPC/brand. |
| 15 | Hillshire Farm Polska Kielbasa Smoked Sausage | `tyson` | Yes | Yes, `hillshire farm` | Overlaps existing Hillshire deli meats and sausage category; no exact kielbasa found. |
| 16 | Aidells Chicken & Apple Smoked Chicken Sausage | `tyson` | Yes | Yes, `aidells` plus product-specific parent map | No exact Aidells manual product found. |
| 17 | Applegate Naturals Chicken & Apple Breakfast Sausage | `hormel` | Yes | No | High overlap with existing Applegate Natural Chicken & Sage Breakfast Sausage; verify flavor and format carefully. |
| 18 | SeaPak Jumbo Butterfly Shrimp | `rich-products` | Maybe refresh | No | Rich Products entry exists and lists SeaPak, but issue data looks older; add brand map if accepted. |
| 19 | Trident Seafoods Alaskan Salmon Burgers | none existing | No | Dangerous partial conflict | `trident` maps to `mondelez` for gum, so parser may misresolve Trident Seafoods. Needs explicit company entry/map. |
| 20 | Gorton's Beer Battered Fish Fillets | none existing | No | No | Parent expected Nissui; no `nissui` company entry found. Needs new company resolution. |

## Source Notes From Resolver

- General Mills Helper sale:
  https://investors.generalmills.com/press-releases/press-release-details/2022/General-Mills-Completes-Sale-of-Helper-and-Suddenly-Salad-Businesses/default.aspx
- Additional ownership leads to verify during product/company research:
  Tasty Bite/Mars, Gorton's/Nissui, and Trident Seafoods private/independent.
