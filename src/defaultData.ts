import { AppData } from "./types";

export const DEFAULT_DATA: AppData = {
  meals: [
    { id: 1, name: "Oatmeal with Banana", category: "breakfast", servings: 1, ingredients: ["oats", "banana", "milk", "honey"] },
    { id: 2, name: "Eggs and Toast", category: "breakfast", servings: 2, ingredients: ["eggs", "bread", "butter"] },
    { id: 3, name: "Greek Yogurt Bowl", category: "breakfast", servings: 1, ingredients: ["greek yogurt", "honey", "almonds"] },
    { id: 4, name: "Chicken Salad", category: "lunch", servings: 2, ingredients: ["chicken breast", "lettuce", "tomatoes", "olive oil"] },
    { id: 5, name: "Rice and Beans", category: "lunch", servings: 3, ingredients: ["rice", "black beans", "onion", "garlic"] },
    { id: 6, name: "Sandwich", category: "lunch", servings: 1, ingredients: ["bread", "cheese", "lettuce", "tomatoes"] },
    { id: 7, name: "Pasta Marinara", category: "dinner", servings: 3, ingredients: ["pasta", "tomato sauce", "garlic", "olive oil", "parmesan"] },
    { id: 8, name: "Stir Fry", category: "dinner", servings: 3, ingredients: ["rice", "chicken breast", "broccoli", "soy sauce", "garlic"] },
    { id: 9, name: "Salmon and Veggies", category: "dinner", servings: 2, ingredients: ["salmon", "broccoli", "olive oil", "lemon"] },
  ],
  staples: {
    "olive oil": "full",
    "salt": "full",
    "pepper": "full",
    "garlic": "full",
    "rice": "full",
    "pasta": "low",
    "soy sauce": "full",
    "honey": "full",
  },
  onHand: {},
  plan: {},
  shoppingDay: null,
};
