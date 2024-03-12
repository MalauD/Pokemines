use serde::Deserialize;

fn max_results_default() -> u32 {
    10
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PaginationOptions {
    #[serde(default)]
    page: usize,
    #[serde(default = "max_results_default")]
    max_results: u32,
}

impl PaginationOptions {
    pub fn get_page(&self) -> usize {
        self.page
    }
    pub fn get_max_results(&self) -> usize {
        self.max_results as usize
    }

    pub fn trim_vec<T: Copy>(&self, input: &[T]) -> Vec<T> {
        let rng = self.get_max_results() * self.get_page()
            ..self.get_max_results() * (self.get_page() + 1);
        let mut vec: Vec<T> = Vec::with_capacity(rng.len());
        for (i, e) in input.iter().enumerate() {
            if rng.contains(&i) {
                vec.push(*e);
            }
        }
        vec
    }
}
