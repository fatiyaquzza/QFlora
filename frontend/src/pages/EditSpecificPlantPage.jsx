import React, { useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";
import AdminLayout from "../components/AdminLayout";
import { useNavigate, useParams } from "react-router-dom";

function EditSpecificPlantPage() {
  const navigate = useNavigate();
  const { id } = useParams(); // Get plant ID from URL
  const [currentStep, setCurrentStep] = useState(1);
  const [form, setForm] = useState({
    name: "",
    latin_name: "",
    image_url: "",
    plant_type_id: "",
    overview: "",
    description: "",
    benefits: "",
    characteristics: "",
    origin: "",
    cultivation: "",
    source_ref: "",
    eng_name: "",
    arab_name: "",
  });

  const [chemicalComponents, setChemicalComponents] = useState([]);
  const [selectedChemicalComponents, setSelectedChemicalComponents] = useState(
    []
  );

  // Add touched state
  const [touched, setTouched] = useState({
    name: false,
    latin_name: false,
    image_url: false,
    plant_type_id: false,
    overview: false,
    description: false,
    benefits: false,
    characteristics: false,
    origin: false,
    cultivation: false,
    source_ref: false,
    eng_name: false,
    arab_name: false,
    chemical_components: false,
  });

  // Store only the selected species ID for the final classification
  const [selectedSpeciesId, setSelectedSpeciesId] = useState(null);

  // All taxonomy data
  const [taxonomyData, setTaxonomyData] = useState({
    subkingdoms: [],
    superdivisions: [],
    divisions: [],
    classes: [],
    subclasses: [],
    orders: [],
    families: [],
    genuses: [],
    species: [],
  });

  // States for taxonomy dropdown options (filtered)
  const [subkingdoms, setSubkingdoms] = useState([]);
  const [superdivisions, setSuperdivisions] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subclasses, setSubclasses] = useState([]);
  const [orders, setOrders] = useState([]);
  const [families, setFamilies] = useState([]);
  const [genera, setGenera] = useState([]);
  const [species, setSpecies] = useState([]);

  // Selected taxonomy items
  const [selectedSubkingdom, setSelectedSubkingdom] = useState("");
  const [selectedSuperdivision, setSelectedSuperdivision] = useState("");
  const [selectedDivision, setSelectedDivision] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubclass, setSelectedSubclass] = useState("");
  const [selectedOrder, setSelectedOrder] = useState("");
  const [selectedFamily, setSelectedFamily] = useState("");
  const [selectedGenus, setSelectedGenus] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Add state for plant types
  const [plantTypes, setPlantTypes] = useState([]);

  // Fetch plant data on component mount
  useEffect(() => {
    const fetchPlantData = async () => {
      try {
        // First fetch taxonomy data
        const taxonomyRes = await axiosClient.get("/api/taxonomy/full");
        setTaxonomyData(taxonomyRes.data);
        setSubkingdoms(taxonomyRes.data.subkingdoms);

        // Then fetch plant data and other data
        const [plantRes, typesRes, chemicalsRes] = await Promise.all([
          axiosClient.get(`/specific-plants/${id}`),
          axiosClient.get("/api/plant-types"),
          axiosClient.get("/api/chemical-components"),
        ]);

        // Set form data
        setForm(plantRes.data);

        // Set plant types
        setPlantTypes(typesRes.data);

        // Set chemical components
        setChemicalComponents(chemicalsRes.data);

        // Set selected chemical components
        const selectedChemIds =
          plantRes.data.chemical_components?.map((comp) => comp.id) || [];
        setSelectedChemicalComponents(selectedChemIds);

        // Set classification data if exists
        if (plantRes.data.classification) {
          const speciesId = plantRes.data.classification.species_id;
          setSelectedSpeciesId(speciesId);

          const species = taxonomyRes.data.species.find(
            (s) => s.id === speciesId
          );
          if (species) {
            setSpecies(
              taxonomyRes.data.species.filter(
                (s) => s.genus_id === species.genus_id
              )
            );

            const genus = taxonomyRes.data.genuses.find(
              (g) => g.id === species.genus_id
            );
            if (genus) {
              setSelectedGenus(genus.id);
              setGenera(
                taxonomyRes.data.genuses.filter(
                  (g) => g.family_id === genus.family_id
                )
              );

              const family = taxonomyRes.data.families.find(
                (f) => f.id === genus.family_id
              );
              if (family) {
                setSelectedFamily(family.id);
                setFamilies(
                  taxonomyRes.data.families.filter(
                    (f) => f.order_id === family.order_id
                  )
                );

                const order = taxonomyRes.data.orders.find(
                  (o) => o.id === family.order_id
                );
                if (order) {
                  setSelectedOrder(order.id);
                  setOrders(
                    taxonomyRes.data.orders.filter(
                      (o) => o.subclass_id === order.subclass_id
                    )
                  );

                  const subclass = taxonomyRes.data.subclasses.find(
                    (sc) => sc.id === order.subclass_id
                  );
                  if (subclass) {
                    setSelectedSubclass(subclass.id);
                    setSubclasses(
                      taxonomyRes.data.subclasses.filter(
                        (sc) => sc.class_id === subclass.class_id
                      )
                    );

                    const classItem = taxonomyRes.data.classes.find(
                      (c) => c.id === subclass.class_id
                    );
                    if (classItem) {
                      setSelectedClass(classItem.id);
                      setClasses(
                        taxonomyRes.data.classes.filter(
                          (c) => c.division_id === classItem.division_id
                        )
                      );

                      const division = taxonomyRes.data.divisions.find(
                        (d) => d.id === classItem.division_id
                      );
                      if (division) {
                        setSelectedDivision(division.id);
                        setDivisions(
                          taxonomyRes.data.divisions.filter(
                            (d) =>
                              d.superdivision_id === division.superdivision_id
                          )
                        );

                        const superdivision =
                          taxonomyRes.data.superdivisions.find(
                            (sd) => sd.id === division.superdivision_id
                          );
                        if (superdivision) {
                          setSelectedSuperdivision(superdivision.id);
                          setSuperdivisions(
                            taxonomyRes.data.superdivisions.filter(
                              (sd) =>
                                sd.subkingdom_id === superdivision.subkingdom_id
                            )
                          );

                          const subkingdom = taxonomyRes.data.subkingdoms.find(
                            (sk) => sk.id === superdivision.subkingdom_id
                          );
                          if (subkingdom) {
                            setSelectedSubkingdom(subkingdom.id);
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Gagal memuat data. Silakan coba lagi.");
      }
    };

    if (id) {
      fetchPlantData();
    }
  }, [id]);

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  // Handle form submission
  const handleSubmitPlantDetails = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const updatedData = {
        ...form,
        chemical_component_ids: selectedChemicalComponents,
      };

      await axiosClient.put(`/specific-plants/${id}`, updatedData);
      setCurrentStep(2);
    } catch (err) {
      console.error("Error updating plant:", err);
      setError("Gagal memperbarui data tanaman. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle classification submission
  const handleSubmitClassification = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await axiosClient.put(`/specific-plants/${id}/classification`, {
        species_id: selectedSpeciesId,
      });

      navigate("/specific-plants");
    } catch (err) {
      console.error("Error updating classification:", err);
      setError("Gagal memperbarui klasifikasi. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  // Render chemical components select
  const renderChemicalComponentsSelect = () => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Kandungan Kimia
      </label>
      <select
        multiple
        className="w-full p-2 border rounded"
        value={selectedChemicalComponents}
        onChange={(e) => {
          const values = Array.from(
            e.target.selectedOptions,
            (option) => option.value
          );
          setSelectedChemicalComponents(values);
          setTouched((prev) => ({ ...prev, chemical_components: true }));
        }}
      >
        {chemicalComponents.map((comp) => (
          <option key={comp.id} value={comp.id}>
            {comp.name}
          </option>
        ))}
      </select>
    </div>
  );

  // Render step one (plant details)
  const renderStepOne = () => (
    <form onSubmit={handleSubmitPlantDetails} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nama Tanaman
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nama Latin
          </label>
          <input
            type="text"
            name="latin_name"
            value={form.latin_name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            URL Gambar
          </label>
          <input
            type="text"
            name="image_url"
            value={form.image_url}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipe Tanaman
          </label>
          <select
            name="plant_type_id"
            value={form.plant_type_id}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Pilih Tipe Tanaman</option>
            {plantTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nama Inggris
          </label>
          <input
            type="text"
            name="eng_name"
            value={form.eng_name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nama Arab
          </label>
          <input
            type="text"
            name="arab_name"
            value={form.arab_name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Ringkasan
        </label>
        <textarea
          name="overview"
          value={form.overview}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          rows="3"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Deskripsi
        </label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          rows="3"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Manfaat
        </label>
        <textarea
          name="benefits"
          value={form.benefits}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          rows="3"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Karakteristik
        </label>
        <textarea
          name="characteristics"
          value={form.characteristics}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          rows="3"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Asal
        </label>
        <textarea
          name="origin"
          value={form.origin}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          rows="3"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Budidaya
        </label>
        <textarea
          name="cultivation"
          value={form.cultivation}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          rows="3"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Referensi
        </label>
        <textarea
          name="source_ref"
          value={form.source_ref}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          rows="3"
          required
        />
      </div>

      {renderChemicalComponentsSelect()}

      {error && <div className="text-red-500 text-sm mt-2">{error}</div>}

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => navigate("/specific-plants")}
          className="px-4 py-2 text-gray-600 bg-gray-100 rounded hover:bg-gray-200"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700 disabled:bg-green-300"
        >
          {isLoading ? "Menyimpan..." : "Lanjut ke Klasifikasi"}
        </button>
      </div>
    </form>
  );

  // Render step two (classification)
  const renderStepTwo = () => (
    <form onSubmit={handleSubmitClassification} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Subkingdom
          </label>
          <select
            value={selectedSubkingdom}
            onChange={(e) => {
              setSelectedSubkingdom(e.target.value);
              const superdivisions = taxonomyData.superdivisions.filter(
                (sd) => sd.subkingdom_id === parseInt(e.target.value)
              );
              setSuperdivisions(superdivisions);
              // Only reset if the selected value doesn't exist in new options
              if (
                !superdivisions.find(
                  (sd) => sd.id === parseInt(selectedSuperdivision)
                )
              ) {
                setSelectedSuperdivision("");
                setDivisions([]);
                setClasses([]);
                setSubclasses([]);
                setOrders([]);
                setFamilies([]);
                setGenera([]);
                setSpecies([]);
                setSelectedSpeciesId(null);
              }
            }}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Pilih Subkingdom</option>
            {subkingdoms.map((sk) => (
              <option key={sk.id} value={sk.id}>
                {sk.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Superdivision
          </label>
          <select
            value={selectedSuperdivision}
            onChange={(e) => {
              setSelectedSuperdivision(e.target.value);
              const divisions = taxonomyData.divisions.filter(
                (d) => d.superdivision_id === parseInt(e.target.value)
              );
              setDivisions(divisions);
              // Only reset if the selected value doesn't exist in new options
              if (!divisions.find((d) => d.id === parseInt(selectedDivision))) {
                setSelectedDivision("");
                setClasses([]);
                setSubclasses([]);
                setOrders([]);
                setFamilies([]);
                setGenera([]);
                setSpecies([]);
                setSelectedSpeciesId(null);
              }
            }}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Pilih Superdivision</option>
            {superdivisions.map((sd) => (
              <option key={sd.id} value={sd.id}>
                {sd.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Division
          </label>
          <select
            value={selectedDivision}
            onChange={(e) => {
              setSelectedDivision(e.target.value);
              const classes = taxonomyData.classes.filter(
                (c) => c.division_id === parseInt(e.target.value)
              );
              setClasses(classes);
              // Only reset if the selected value doesn't exist in new options
              if (!classes.find((c) => c.id === parseInt(selectedClass))) {
                setSelectedClass("");
                setSubclasses([]);
                setOrders([]);
                setFamilies([]);
                setGenera([]);
                setSpecies([]);
                setSelectedSpeciesId(null);
              }
            }}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Pilih Division</option>
            {divisions.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Class
          </label>
          <select
            value={selectedClass}
            onChange={(e) => {
              setSelectedClass(e.target.value);
              const subclasses = taxonomyData.subclasses.filter(
                (sc) => sc.class_id === parseInt(e.target.value)
              );
              setSubclasses(subclasses);
              // Only reset if the selected value doesn't exist in new options
              if (
                !subclasses.find((sc) => sc.id === parseInt(selectedSubclass))
              ) {
                setSelectedSubclass("");
                setOrders([]);
                setFamilies([]);
                setGenera([]);
                setSpecies([]);
                setSelectedSpeciesId(null);
              }
            }}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Pilih Class</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Subclass
          </label>
          <select
            value={selectedSubclass}
            onChange={(e) => {
              setSelectedSubclass(e.target.value);
              const orders = taxonomyData.orders.filter(
                (o) => o.subclass_id === parseInt(e.target.value)
              );
              setOrders(orders);
              // Only reset if the selected value doesn't exist in new options
              if (!orders.find((o) => o.id === parseInt(selectedOrder))) {
                setSelectedOrder("");
                setFamilies([]);
                setGenera([]);
                setSpecies([]);
                setSelectedSpeciesId(null);
              }
            }}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Pilih Subclass</option>
            {subclasses.map((sc) => (
              <option key={sc.id} value={sc.id}>
                {sc.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Order
          </label>
          <select
            value={selectedOrder}
            onChange={(e) => {
              setSelectedOrder(e.target.value);
              const families = taxonomyData.families.filter(
                (f) => f.order_id === parseInt(e.target.value)
              );
              setFamilies(families);
              // Only reset if the selected value doesn't exist in new options
              if (!families.find((f) => f.id === parseInt(selectedFamily))) {
                setSelectedFamily("");
                setGenera([]);
                setSpecies([]);
                setSelectedSpeciesId(null);
              }
            }}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Pilih Order</option>
            {orders.map((o) => (
              <option key={o.id} value={o.id}>
                {o.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Family
          </label>
          <select
            value={selectedFamily}
            onChange={(e) => {
              setSelectedFamily(e.target.value);
              const genera = taxonomyData.genuses.filter(
                (g) => g.family_id === parseInt(e.target.value)
              );
              setGenera(genera);
              // Only reset if the selected value doesn't exist in new options
              if (!genera.find((g) => g.id === parseInt(selectedGenus))) {
                setSelectedGenus("");
                setSpecies([]);
                setSelectedSpeciesId(null);
              }
            }}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Pilih Family</option>
            {families.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Genus
          </label>
          <select
            value={selectedGenus}
            onChange={(e) => {
              setSelectedGenus(e.target.value);
              const species = taxonomyData.species.filter(
                (s) => s.genus_id === parseInt(e.target.value)
              );
              setSpecies(species);
              // Only reset if the selected value doesn't exist in new options
              if (!species.find((s) => s.id === parseInt(selectedSpeciesId))) {
                setSelectedSpeciesId(null);
              }
            }}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Pilih Genus</option>
            {genera.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Species
          </label>
          <select
            value={selectedSpeciesId || ""}
            onChange={(e) => setSelectedSpeciesId(e.target.value)}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Pilih Species</option>
            {species.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && <div className="text-red-500 text-sm mt-2">{error}</div>}

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => setCurrentStep(1)}
          className="px-4 py-2 text-gray-600 bg-gray-100 rounded hover:bg-gray-200"
        >
          Kembali
        </button>
        <button
          type="submit"
          disabled={isLoading || !selectedSpeciesId}
          className="px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700 disabled:bg-green-300"
        >
          {isLoading ? "Menyimpan..." : "Simpan"}
        </button>
      </div>
    </form>
  );

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">Edit Tanaman Spesifik</h1>

        {/* Progress steps */}
        <div className="mb-8">
          <div className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep === 1 ? "bg-green-600 text-white" : "bg-gray-300"
              }`}
            >
              1
            </div>
            <div className="flex-1 h-1 mx-4 bg-gray-300">
              <div
                className={`h-full ${
                  currentStep === 2 ? "bg-green-600" : "bg-gray-300"
                }`}
              />
            </div>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep === 2 ? "bg-green-600 text-white" : "bg-gray-300"
              }`}
            >
              2
            </div>
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-sm">Detail Tanaman</span>
            <span className="text-sm">Klasifikasi</span>
          </div>
        </div>

        {/* Form steps */}
        {currentStep === 1 ? renderStepOne() : renderStepTwo()}
      </div>
    </AdminLayout>
  );
}

export default EditSpecificPlantPage;
